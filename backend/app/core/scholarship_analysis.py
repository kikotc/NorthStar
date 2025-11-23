# backend/app/core/scholarship_analysis.py

from typing import Dict, Any, List
import json
from json import JSONDecodeError

from ..infrastructure.scholarship_repo import get_scholarship
from ..infrastructure.ai_client import get_claude_client, MODEL_NAME


async def analyze_scholarship_priorities(scholarship_id: str) -> Dict[str, Any]:
    """
    Deep-dive analysis for a single scholarship.

    Used when the user has ALREADY chosen a scholarship and wants to start
    working on an essay. Here we:
    - Look up the scholarship in our JSON.
    - Identify the institution/college that offers it.
    - Call Claude WITH web search enabled so it can:
        * Read about the scholarship online.
        * Read about the institution/college values.
        * Infer hidden priorities that aren't obvious from the short description.
        * Assign weights to up to THREE main priorities.
        * Suggest essay strategies aligned with those priorities.

    Returns a JSON-serializable dict with fields like:
    {
      "scholarship_id": "8",
      "scholarship_title": "Some Award",
      "institution": "Victoria College, University of Toronto",
      "priorities": [
        {
          "name": "academic_excellence",
          "weight": 0.4,
          "reason": "Strong emphasis on GPA and academic awards."
        },
        {
          "name": "leadership",
          "weight": 0.35,
          "reason": "Rewards leadership in college and student life."
        },
        {
          "name": "community_service",
          "weight": 0.25,
          "reason": "Highlights impact on wider community and volunteer work."
        }
      ],
      "essay_strategies": [
        "Open with a concrete academic achievement tied to impact.",
        "Show specific leadership roles within the college or university.",
        "Tie community work back to the institution's stated values."
      ]
    }
    """
    scholarship = get_scholarship(scholarship_id)
    if not scholarship:
        raise ValueError(f"Scholarship {scholarship_id} not found")

    # Try to infer which unit/college/department gives this scholarship.
    institution = (
        scholarship.get("institution")
        or scholarship.get("college")
        or scholarship.get("faculty")
        or scholarship.get("division")
        or scholarship.get("department")
        or scholarship.get("unit")
        or "University of Toronto"
    )

    payload = {
        "scholarship": {
            "id": str(scholarship.get("id")),
            "title": scholarship.get("title") or scholarship.get("name"),
            "description": scholarship.get("description"),
            "value": scholarship.get("value"),
            "deadline": scholarship.get("deadline"),
            "level_of_study": scholarship.get("level_of_study"),
            "legal_status": scholarship.get("legal_status"),
            "institution": institution,
        }
    }

    system_prompt = """
You are analyzing ONE specific scholarship in depth.

You will receive JSON with:
- "scholarship": an object containing:
    - id
    - title
    - description
    - value
    - deadline
    - level_of_study
    - legal_status
    - institution (the college/faculty/unit that offers it)

Your job is to go BEYOND the short catalog description by:
1. Using web search to look up:
   - The scholarship by name + institution.
   - The institution/college itself (e.g., Victoria College, Faculty of Arts & Science).
   Focus on official university pages, scholarship pages, and related trustworthy sources.

2. From BOTH:
   - the provided scholarship description, AND
   - the web search results,
   extract:
   (a) Visible / explicit requirements (what is written clearly).
   (b) Hidden / implicit priorities (what the institution REALLY seems to care about).

3. Based on that, identify up to THREE MAIN PRIORITIES for this scholarship.
   Each priority must:
   - Have a "name" chosen from this fixed set:
       * "academic_excellence"
       * "leadership"
       * "community_service"
       * "research_potential"
       * "financial_need"
       * "adversity_or_resilience"
   - Have a "weight" between 0.0 and 1.0 (float).
   - The SUM of all priority weights should be approximately 1.0.
   - Have a short "reason" (max ~15 words) explaining why this priority matters
     for this scholarship.

   IMPORTANT: You MUST return AT MOST 3 priorities. If more seem relevant,
   pick the 3 MOST important ones.

4. Suggest concrete ESSAY STRATEGIES:
   A short list of specific, actionable tips for how a student should frame
   their story to align with these main priorities and the institution's values.

You MUST respond with STRICT JSON, containing ONLY this object
and NOTHING else (no markdown, no prose, no code fences):

{
  "scholarship_id": "string",
  "scholarship_title": "string",
  "institution": "string",
  "priorities": [
    {
      "name": "academic_excellence",
      "weight": 0.4,
      "reason": "short explanation of why this is important"
    }
  ],
  "essay_strategies": [
    "short, concrete essay tip 1",
    "short, concrete essay tip 2"
  ]
}

Rules:
- The "priorities" array MUST contain between 1 and 3 items.
- Each "weight" must be a float between 0.0 and 1.0.
- The sum of all "weight" values should be close to 1.0.
- Do NOT include citations or URLs inside the JSON.
- The output MUST start with '{' and end with '}'.
""".strip()

    client = get_claude_client()

    try:
        message = client.messages.create(
            model=MODEL_NAME,
            max_tokens=1800,
            temperature=0.3,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": json.dumps(payload),
                }
            ],
            tools=[
                {
                    "type": "web_search_20250305",
                    "name": "web_search",
                    "max_uses": 3,
                }
            ],
        )
    except Exception as e:
        raise RuntimeError(f"Error while calling Claude for scholarship analysis: {e}")

    # Extract ONLY text blocks from the response.
    text_chunks: List[str] = []
    for block in message.content:
        if block.type == "text":
            text_chunks.append(block.text)

    raw_text = "\n".join(text_chunks).strip()
    print("RAW CLAUDE OUTPUT (scholarship_analysis):", raw_text)

    # Try strict JSON first, then a fallback using { ... } slice.
    try:
        data = json.loads(raw_text)
    except JSONDecodeError:
        start = raw_text.find("{")
        end = raw_text.rfind("}")
        if start != -1 and end != -1:
            candidate = raw_text[start : end + 1]
            try:
                data = json.loads(candidate)
            except JSONDecodeError:
                raise ValueError(
                    "Claude returned invalid JSON for scholarship analysis."
                )
        else:
            raise ValueError(
                "Claude returned output without any JSON object for scholarship analysis."
            )

    # Minimal sanity checks for expected shape
    if not isinstance(data, dict) or "priorities" not in data:
        raise ValueError(
            "Claude analysis JSON is missing expected 'priorities' field."
        )

    priorities = data.get("priorities")
    if not isinstance(priorities, list) or len(priorities) == 0:
        raise ValueError("Claude returned an empty or invalid 'priorities' list.")

    # Enforce at most 3 priorities in case Claude misbehaves
    if len(priorities) > 3:
        data["priorities"] = priorities[:3]

    return data
