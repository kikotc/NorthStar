# backend/app/core/scholarship_analysis.py

from typing import Dict
from ..infrastructure.scholarship_repo import (
    get_scholarship,
    get_winner_stories_for_scholarship,
)
from ..infrastructure.ai_client import ask_claude
import json


async def get_scholarship_with_winners(scholarship_id: str) -> Dict:
    """
    Simple helper: return the scholarship + its winner stories from JSON.
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
    Use Claude to analyze one scholarship and its winner stories,
    and return priorities + weights + explanations.
    """
    data = await get_scholarship_with_winners(scholarship_id)
    scholarship = data["scholarship"]
    winners = data["winner_stories"]

    description = scholarship.get("description", "")

    prompt = f"""
You analyze scholarship descriptions and winner stories.

Return STRICT JSON with this structure:

{{
  "priorities": [
    {{
      "id": "academic_excellence",
      "label": "Academic Excellence",
      "base_weight": 80,
      "explanation": "Why this matters"
    }}
  ],
  "justification": "Overall explanation of how weights were chosen.",
  "winner_influence_note": "How winner patterns influenced this."
}}

SCHOLARSHIP DESCRIPTION:
\"\"\"{description}\"\"\"

WINNER STORIES (JSON list):
{json.dumps(winners, ensure_ascii=False, indent=2)}
"""

    raw = await ask_claude(prompt)
    # Claude will respond with JSON string; we parse it.
    analysis = json.loads(raw)

    # Optionally include id back in the response
    analysis["scholarship_id"] = scholarship_id
    return analysis
