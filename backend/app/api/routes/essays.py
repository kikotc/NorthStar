# backend/app/api/routes/essays.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from app.infrastructure.scholarship_repo import (
    get_scholarship,
    get_winner_stories_for_scholarship,
)
from app.infrastructure.ai_client import ask_claude


router = APIRouter(
    prefix="/api/essays",
    tags=["essays"],
)


class PriorityWeight(BaseModel):
    id: str
    label: Optional[str] = None
    weight: float


class EssayRequest(BaseModel):
    scholarship_id: str
    profile_summary: str  # student’s own story in 1–2 paragraphs
    priorities: List[PriorityWeight]
    target_length_words: int = 600
    tone: Optional[str] = "confident, reflective, and sincere"


class EssayResponse(BaseModel):
    scholarship_id: str
    essay: str
    priorities: List[PriorityWeight]


@router.post("/generate", response_model=EssayResponse)
async def generate_essay(req: EssayRequest):
    """
    Generate a tailored essay for a given scholarship using:
    - scholarship description
    - winner stories (if any)
    - student profile summary
    - selected priorities + weights
    """
    scholarship = get_scholarship(req.scholarship_id)
    if not scholarship:
        raise HTTPException(
            status_code=404,
            detail=f"Scholarship {req.scholarship_id} not found",
        )

    winners = get_winner_stories_for_scholarship(req.scholarship_id)

    # Build a compact string for priorities
    priorities_str = "\n".join(
        f"- {p.id} ({p.label or p.id}): {p.weight:.1f}%"
        for p in req.priorities
    )

    prompt = f"""
You are helping a student draft a STRONG scholarship essay.

Write a first-person essay for the scholarship below.

SCHOLARSHIP:
Name: {scholarship.get("name")}
Description: {scholarship.get("description", "")}
Category: {scholarship.get("category", "")}

WINNER STORIES (may be empty, JSON):
{winners}

PRIORITY WEIGHTS (focus more on higher weights):
{priorities_str}

STUDENT PROFILE SUMMARY (this is the raw material, do not invent facts):
\"\"\"{req.profile_summary}\"\"\"

TASK:
- Draft a compelling, coherent essay of around {req.target_length_words} words.
- Use a {req.tone} tone.
- Strong structure: clear opening, 1–3 body sections, and a conclusion.
- Explicitly highlight experiences that match the top-weighted priorities.
- Do NOT add fake awards or experiences; only reframe what is in the profile summary.
- Return ONLY the essay text, no JSON, no headings, no bullet points.
    """

    try:
        essay_text = await ask_claude(prompt)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Claude essay generation failed: {e}",
        )

    return EssayResponse(
        scholarship_id=req.scholarship_id,
        essay=essay_text,
        priorities=req.priorities,
    )
