# backend/app/core/scholarship_analysis.py

from typing import Dict
import json

from app.infrastructure.scholarship_repo import (
    get_scholarship,
    get_winner_stories_for_scholarship,
)
from app.infrastructure.ai_client import ask_claude


async def get_scholarship_with_winners(scholarship_id: str) -> Dict:
    """
    Return the scholarship + its winner stories from JSON.
    Raises ValueError if the scholarship is not found.
    """
    scholarship = get_scholarship(scholarship_id)
    if not scholarship:
        raise ValueError(f"Scholarship {scholarship_id} not found")

    winners = get_winner_stories_for_scholarship(scholarship_id)

    return {
        "scholarship": scholarship,
        "winner_stories": winners,
    }


async def analyze_scholarship_priorities(scholarship_id: str) -> Dict:
    """
    Use Claude to analyze one scholarship and its winner stories.

    For hackathon robustness:
      - We DO call Claude
      - We do NOT trust it to return valid JSON
      - We return whatever Claude says as plain text in 'analysis_text'
      - If Claude fails, we return an 'error' field instead of 500.
    """
    data = await get_scholarship_with_winners(scholarship_id)
    scholarship = data["scholarship"]
    winners = data["winner_stories"]

    description = scholarship.get("description", "")

    prompt = f"""
You are analyzing a scholarship description and (optionally) some winner stories.

TASK:
- Identify the main priorities this scholarship actually cares about.
- For each priority, give:
    - a short id (snake_case)
    - a human label
    - an approximate weight (0–100, rough, just your judgment)
    - 1–2 sentence explanation.
- Then give a short overall justification.

FORMAT:
Return a clear, readable explanation for humans. It does NOT need to be strict JSON.
You can format as bullet points.

SCHOLARSHIP DESCRIPTION:
\"\"\"{description}\"\"\"

WINNER STORIES (JSON list, may be empty):
{json.dumps(winners, ensure_ascii=False, indent=2)}
"""

    try:
        raw_reply = await ask_claude(prompt)
        # No json.loads here: we just pass the text back.
        return {
            "scholarship_id": scholarship_id,
            "scholarship": scholarship,
            "winner_stories": winners,
            "analysis_text": raw_reply,
        }
    except Exception as e:
        # Avoid 500s: surface the error as data instead.
        return {
            "scholarship_id": scholarship_id,
            "scholarship": scholarship,
            "winner_stories": winners,
            "error": "claude_call_failed",
            "details": str(e),
        }
