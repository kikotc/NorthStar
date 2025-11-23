# backend/app/api/routes/scholarships.py

from typing import List, Optional, Dict
import json
from json import JSONDecodeError

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# You are running `uvicorn app.main:app`, so imports are from app.*
from ...infrastructure.scholarship_repo import (
    list_scholarships,
    get_scholarship,
)
from ...core.scholarship_analysis import analyze_scholarship_priorities
from ...infrastructure.ai_client import get_claude_client

router = APIRouter(
    prefix="/api/scholarships",
    tags=["scholarships"],
)

# -------------------------------------------------------------------
# EXISTING ROUTES (unchanged)
# -------------------------------------------------------------------


@router.get("/", summary="List all scholarships")
def list_all_scholarships():
    """Return all scholarships from the local JSON file."""
    return list_scholarships()


@router.get("/{scholarship_id}", summary="Get one scholarship by id")
def get_scholarship_by_id(scholarship_id: str):
    """
    Fetch a single scholarship (no AI, just JSON lookup).
    scholarship_id should match the 'id' field (we compare as strings).
    """
    s = get_scholarship(scholarship_id)
    if not s:
        raise HTTPException(
            status_code=404,
            detail=f"Scholarship {scholarship_id} not found",
        )
    return s


@router.get(
    "/{scholarship_id}/analysis",
    summary="AI analysis of scholarship priorities",
)
async def scholarship_analysis(scholarship_id: str):
    """
    Use Claude + winner stories to produce a priorities/weights analysis.
    We catch ValueError from the core function and turn it into 404 instead
    of a 500 Internal Server Error.
    """
    try:
        analysis = await analyze_scholarship_priorities(scholarship_id)
        return analysis
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# -------------------------------------------------------------------
# MODELS FOR TOP-5 MATCHING
# -------------------------------------------------------------------


class UserProfileInput(BaseModel):
    full_name: str
    university: str
    program: str
    year: int
    # e.g. "domestic", "international"
    residency_status: str

    ethnicities: List[str] = []

    experiences: List[str] = []
    interests: List[str] = []
    awards: List[str] = []
    skills: List[str] = []


class ScholarshipMatchResult(BaseModel):
    id: str
    title: str
    value: Optional[str] = None
    deadline: Optional[str] = None
    level_of_study: Optional[str] = None
    legal_status: Optional[str] = None
    description: Optional[str] = None

    match_percentage: float
    reason: Optional[str] = None


class ScholarshipMatchResponse(BaseModel):
    matches: List[ScholarshipMatchResult]


# -------------------------------------------------------------------
# NEW ROUTE: TOP 5 MATCHES WITH DOMESTIC/INTERNATIONAL FILTER
# AND "HIDDEN PRIORITY" / WEIGHT PROFILE LOGIC
# -------------------------------------------------------------------


@router.post("/match", response_model=ScholarshipMatchResponse)
async def match_scholarships(profile: UserProfileInput) -> ScholarshipMatchResponse:
    """
    Given a user's profile, return the TOP 5 most compatible scholarships
    with a match percentage computed by Claude.

    Algorithm (high level):
    1. Load all scholarships from local JSON.
    2. Filter by residency_status (domestic vs international) using scholarship.legal_status.
    3. Send ONLY that filtered subset + student profile to Claude.
    4. In the prompt, ask Claude to:
       - Infer a hidden "weight profile" (academics, leadership, community, research,
         financial need, adversity, etc.) for each scholarship, using description and
         (conceptually) web research on the scholarship page.
       - Map the student's experiences/awards into the same dimensions.
       - Compute a match_percentage and a very short reason for each scholarship.
    5. Parse Claude's JSON, sort by match_percentage, and return the top 5.
    """

    # 1) Load scholarships from JSON
    scholarships = list_scholarships()

    if not scholarships:
        raise HTTPException(
            status_code=500,
            detail="No scholarships available.",
        )

    # 2) Filter by domestic / international to reduce search space
    #    We expect scholarship["legal_status"] to be something like:
    #    "domestic", "international", "both", or empty/None.
    residency = profile.residency_status.lower()
    eligible: List[Dict] = []

    for s in scholarships:
        legal = (s.get("legal_status") or "").lower().strip()

        # Treat empty legal_status as "both"
        if not legal:
            legal = "both"

        if residency == "domestic":
            if legal in ("domestic", "both"):
                eligible.append(s)
        else:  # international
            if legal in ("international", "both"):
                eligible.append(s)

    # Safety fallback: if filtering removed everything, fall back to all scholarships
    if not eligible:
        eligible = scholarships

    # 3) Build compact summaries to send to Claude
    scholarship_summaries: List[Dict] = []
    for s in eligible:
        scholarship_summaries.append(
            {
                "id": str(s.get("id")),
                "title": s.get("title") or s.get("name"),
                "value": s.get("value"),
                "deadline": s.get("deadline"),
                "level_of_study": s.get("level_of_study"),
                "legal_status": s.get("legal_status"),
                "description": s.get("description"),
            }
        )

    if not scholarship_summaries:
        raise HTTPException(
            status_code=500,
            detail="No eligible scholarships found after filtering.",
        )

    client = get_claude_client()

    # 4) System prompt:
    #    - Mentions hidden requirements + weight profiles
    #    - Allows web research conceptually
    #    - Forces STRICT JSON and short reasons
    system_prompt = """
You are an assistant that matches scholarships to a student.

You will receive JSON with:
- "student_profile": the student's info, experiences, interests, and awards.
- "scholarships": a list of scholarships with id, title, description, value,
  deadline, level_of_study, and legal_status.

Your task for EACH scholarship:
1. Infer a hidden "weight profile" over these dimensions:
   - academic_excellence
   - leadership
   - community_service
   - research_potential
   - financial_need
   - adversity_or_resilience

   Use both the short description AND, in principle, any information that
   would be available from the official scholarship page or related university
   resources (i.e., imagine you can do web research to understand the real,
   often implicit priorities of the committee).

2. Infer a similar weight profile for the student, based on:
   - their program, year, residency_status
   - their ethnicities (only when relevant and fair for eligibility)
   - their experiences, interests, skills, and awards.

3. Conceptually compute a compatibility score by comparing the scholarship's
   weight profile to the student's weight profile (e.g., via a dot product
   or similarity measure).

4. Turn that compatibility into:
   - "match_percentage": a float between 0 and 100.
   - "reason": ONE VERY SHORT sentence (max ~15 words) explaining the match
     in natural language.

Important:
- The scholarships you receive are ALREADY filtered for basic eligibility
  (domestic vs international), so focus on *fit*, not eligibility screening.

You MUST respond with STRICT JSON in exactly this shape.
The response MUST:
- contain ONLY JSON
- NOT include any explanations, markdown, or code fences
- start with '{' and end with '}':

{
  "matches": [
    {
      "scholarship_id": "string",
      "match_percentage": 0-100,
      "reason": "short one-sentence explanation"
    }
  ]
}

Include one entry for EVERY scholarship you are given.
Do not say anything else besides this JSON object.
""".strip()

    user_payload = {
        "student_profile": profile.model_dump(),
        "scholarships": scholarship_summaries,
    }

    # 5) Call Claude (use enough tokens so JSON isn't cut off)
    try:
        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",  # your chosen model
            max_tokens=2000,                     # FIX: more tokens than before
            temperature=0.3,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": json.dumps(user_payload),
                }
            ],
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error while calling Claude for scholarship matching: {e}",
        )

    # 6) Get raw text and try to parse JSON (with a fallback for ```json fences)
    raw_text = message.content[0].text
    print("RAW CLAUDE OUTPUT (match_scholarships):", raw_text)

    try:
        ai_data = json.loads(raw_text)
    except JSONDecodeError:
        # Fallback: try to extract JSON between first '{' and last '}'
        start = raw_text.find("{")
        end = raw_text.rfind("}")
        if start != -1 and end != -1:
            candidate = raw_text[start : end + 1]
            try:
                ai_data = json.loads(candidate)
            except JSONDecodeError:
                raise HTTPException(
                    status_code=500,
                    detail=(
                        "Claude returned invalid JSON while computing scholarship "
                        "matches (candidate parse failed)."
                    ),
                )
        else:
            raise HTTPException(
                status_code=500,
                detail=(
                    "Claude returned output without any JSON object while computing "
                    "scholarship matches."
                ),
            )

    raw_matches = ai_data.get("matches", [])
    if not isinstance(raw_matches, list) or not raw_matches:
        raise HTTPException(
            status_code=500,
            detail="Claude did not return any scholarship matches.",
        )

    # 7) Build mapping from scholarship_id -> match info
    scores_by_id: Dict[str, Dict] = {}
    for m in raw_matches:
        sid = str(m.get("scholarship_id"))
        if not sid or "match_percentage" not in m:
            continue
        scores_by_id[sid] = m

    # 8) Combine JSON data + AI scores into response objects
    summary_by_id: Dict[str, Dict] = {s["id"]: s for s in scholarship_summaries}
    results: List[ScholarshipMatchResult] = []

    for sid, score_entry in scores_by_id.items():
        scholarship = summary_by_id.get(sid)
        if not scholarship:
            # Claude returned an ID that isn't in our data: skip it
            continue

        try:
            percentage = float(score_entry["match_percentage"])
        except (TypeError, ValueError):
            continue

        results.append(
            ScholarshipMatchResult(
                id=sid,
                title=scholarship["title"],
                value=scholarship["value"],
                deadline=scholarship["deadline"],
                level_of_study=scholarship["level_of_study"],
                legal_status=scholarship["legal_status"],
                description=scholarship["description"],
                match_percentage=percentage,
                reason=score_entry.get("reason"),
            )
        )

    if not results:
        raise HTTPException(
            status_code=500,
            detail=(
                "No valid scholarship matches could be built from Claude output."
            ),
        )

    # 9) Sort by match_percentage and return top 5
    results.sort(key=lambda r: r.match_percentage, reverse=True)
    top_five = results[:5]

    return ScholarshipMatchResponse(matches=top_five)
