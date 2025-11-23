# backend/app/api/routes/essays.py

from __future__ import annotations

from typing import List, Optional, Dict
import json

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ...infrastructure.scholarship_repo import get_scholarship
from ...infrastructure.success_story_repo import find_best_matching_story
from ...infrastructure.ai_client import get_claude_client, MODEL_NAME

router = APIRouter(
    prefix="/api/essays",
    tags=["essays"],
)


# ---------- Pydantic models ----------


class PrioritySelection(BaseModel):
    """Priority selected by the user, with a weight after re-weighting in the UI."""
    name: str  # e.g., "academic_excellence"
    weight: float = Field(..., ge=0.0)


class EssayStudentProfile(BaseModel):
    """Minimal student profile needed to personalize the essay."""
    full_name: str
    university: Optional[str] = None
    program: Optional[str] = None
    year: Optional[int] = None
    residency_status: Optional[str] = None  # "domestic" / "international"

    experiences: List[str] = []
    interests: List[str] = []
    awards: List[str] = []


class EssayGenerationRequest(BaseModel):
    scholarship_id: str
    selected_priorities: List[PrioritySelection]
    student_profile: EssayStudentProfile


class EssayResponse(BaseModel):
    essay: str
    scholarship_id: str
    scholarship_title: Optional[str]
    winner_story_id: Optional[str]
    winner_story_recipient_name: Optional[str]
    priorities: List[PrioritySelection]


# ---------- Helper: normalize priorities ----------


def _normalize_priorities(priorities: List[PrioritySelection]) -> Dict[str, float]:
    """
    Take the selected priorities (with user-set weights) and normalize them
    so the weights sum to ~1.0. If all weights are zero, spread evenly.
    """
    if not priorities:
        return {}

    total = sum(p.weight for p in priorities)
    if total <= 0:
        # all zero or invalid -> equal distribution
        equal_weight = 1.0 / len(priorities)
        return {p.name: equal_weight for p in priorities}

    return {p.name: p.weight / total for p in priorities}


# ---------- Route: generate essay ----------


@router.post("/generate", response_model=EssayResponse)
async def generate_essay(req: EssayGenerationRequest) -> EssayResponse:
    """
    Generate a scholarship essay draft in TWO conceptual layers:

    1) Content layer:
       - Use the scholarship info.
       - Use the user's chosen priorities and their re-weighted importance.
       - Use the student's profile (experiences, interests, awards) to
         ground the essay in their real story.

    2) Style layer:
       - Find the most compatible winner story based on overlapping priorities
         (no API call, just comparing weights).
       - Use that story's "style_profile" (hook_style, tone, voice_notes,
         emotional_pacing) to shape the essay's voice and narrative flow.

    The final result is one literacy-fulfilled essay draft ready for the user
    to edit in the UI.
    """

    # 1) Fetch scholarship from JSON
    scholarship = get_scholarship(req.scholarship_id)
    if not scholarship:
        raise HTTPException(
            status_code=404,
            detail=f"Scholarship {req.scholarship_id} not found",
        )

    # 2) Normalize the selected priorities to get a clean weight profile
    norm_weights = _normalize_priorities(req.selected_priorities)
    if not norm_weights:
        raise HTTPException(
            status_code=400,
            detail="At least one priority with a non-negative weight is required.",
        )

    # 3) Pick the most compatible success story (pure Python, no AI)
    winner_story = find_best_matching_story(norm_weights)

    winner_style_profile: Optional[Dict] = None
    winner_story_summary: Optional[str] = None
    winner_story_id: Optional[str] = None
    winner_story_recipient_name: Optional[str] = None

    if winner_story:
        winner_style_profile = winner_story.get("style_profile") or {}
        story_paragraphs = winner_story.get("story_paragraphs") or []
        # Short summary for Claude to get a feel for the narrative arc
        winner_story_summary = "\n\n".join(story_paragraphs[:2])
        winner_story_id = winner_story.get("id")
        winner_story_recipient_name = winner_story.get("recipient_name")

    # 4) Build payload for Claude
    student_profile_dict = req.student_profile.model_dump()

    scholarship_payload = {
        "id": str(scholarship.get("id")),
        "title": scholarship.get("title") or scholarship.get("name"),
        "description": scholarship.get("description"),
        "value": scholarship.get("value"),
        "deadline": scholarship.get("deadline"),
        "level_of_study": scholarship.get("level_of_study"),
        "legal_status": scholarship.get("legal_status"),
        "institution": (
            scholarship.get("institution")
            or scholarship.get("college")
            or scholarship.get("faculty")
            or scholarship.get("division")
            or scholarship.get("department")
            or scholarship.get("unit")
            or "University of Toronto"
        ),
    }

    priorities_payload = [
        {"name": p.name, "weight": norm_weights[p.name]}
        for p in req.selected_priorities
        if p.name in norm_weights
    ]

    payload = {
        "student_profile": student_profile_dict,
        "scholarship": scholarship_payload,
        "selected_priorities": priorities_payload,
        "winner_story_style_profile": winner_style_profile,
        "winner_story_summary": winner_story_summary,
    }

    system_prompt = """
You are an expert scholarship essay coach and ghostwriter.

You will receive JSON with:
- "student_profile": info about the student (name, program, experiences, interests, awards).
- "scholarship": details about the scholarship (title, description, value, institution, etc.).
- "selected_priorities": up to 3 priorities that the student chose to focus on,
  each with a normalized weight between 0.0 and 1.0 representing importance
  for THIS particular draft.
- "winner_story_style_profile": an OPTIONAL style profile from a real success story,
  containing:
    * "hook_style"           (e.g., personal_identity_introduction)
    * "tone"                 (e.g., inspirational_supportive)
    * "voice_notes"          (e.g., first_person, authentic, community-oriented)
    * "emotional_pacing"     (e.g., starts_personal → hardship_reveal → perseverance → advocacy_outlook)
- "winner_story_summary": an OPTIONAL 1–2 paragraph summary of the success story.

Your job happens in TWO conceptual layers, but you produce ONE final essay:

1) CONTENT LAYER:
   - Use the scholarship description + institution to understand the context.
   - Use the student's profile to ground the essay in their real experiences.
   - Use the selected priorities and their weights to decide what to emphasize.
   - Heavily focus on the highest-weight priorities, but still acknowledge the others.
   - Structure the essay like a strong scholarship statement:
     * Hook
     * 2–3 body paragraphs
     * Short conclusion that ties back to the scholarship/institution.

2) STYLE LAYER:
   - If a "winner_story_style_profile" is provided:
       * Apply the hook_style (e.g., start with personal identity).
       * Match the general tone (e.g., inspirational_supportive).
       * Follow the indicated emotional_pacing (e.g., personal → challenge → perseverance → impact).
       * Respect the voice_notes (e.g., first_person, authentic, community-oriented).
   - Your goal is NOT to copy the winner story content,
     but to echo the same kind of narrative rhythm and emotional arc.

Output requirements:
- Write in the FIRST PERSON, as if you are the student.
- The essay should be around 600–800 words (can be shorter if needed, but not a tweet).
- Do NOT mention that you used another winner story.
- Do NOT mention priorities, weights, or style_profile explicitly.
- Do NOT include JSON or any extra metadata.
- Output ONLY the final essay as plain text, nothing else.
""".strip()

    client = get_claude_client()

    try:
        message = client.messages.create(
            model=MODEL_NAME,
            max_tokens=1200,
            temperature=0.6,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": json.dumps(payload),
                }
            ],
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error while calling Claude for essay generation: {e}",
        )

    # Collect text blocks into a single essay string
    essay_chunks: List[str] = []
    for block in message.content:
        if block.type == "text":
            essay_chunks.append(block.text)

    essay_text = "\n".join(essay_chunks).strip()

    if not essay_text:
        raise HTTPException(
            status_code=500,
            detail="Claude did not return any essay content.",
        )

    return EssayResponse(
        essay=essay_text,
        scholarship_id=str(scholarship.get("id")),
        scholarship_title=scholarship.get("title") or scholarship.get("name"),
        winner_story_id=winner_story_id,
        winner_story_recipient_name=winner_story_recipient_name,
        priorities=req.selected_priorities,
    )
