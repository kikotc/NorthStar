# backend/app/infrastructure/scoring_engine.py

import re
import json
from typing import Dict, Any

from ..infrastructure.ai_client import ask_claude


# ---------- 1. LOCAL KEYWORD-BASED SCORE (FAST, CHEAP) ----------

def score_essay_local(essay_text: str, weights: Dict[str, float]) -> float:
    """
    Simple keyword-based score function for hackathon demo.

    Parameters:
        essay_text: the draft essay (string)
        weights: dict mapping priority_id -> weight (0-100)
            Example:
            {
                "academic_excellence": 52.0,
                "research_plan": 48.0,
                "community_service": 0.0
            }

    Logic:
        - Convert essay to lowercase
        - For each priority ID:
            - Replace underscores with spaces to create a keyword
            - If keyword is found in essay => add its weight
        - Result is capped to 100

    This is a deterministic baseline that doesn't call Claude.
    """

    score = 0.0
    text = essay_text.lower()

    for priority_id, weight in weights.items():
        keyword = priority_id.replace("_", " ").lower()

        # Word boundary regex to avoid partial matches
        if re.search(rf"\b{re.escape(keyword)}\b", text):
            score += weight

    # Normalize score to 0–100
    return min(score, 100.0)


# ---------- 2. CLAUDE + WEB CONTEXT SCORE (SMART, RICH) ----------

async def score_essay_with_web(
    essay_text: str,
    weights: Dict[str, float],
    scholarship_description: str,
    scholarship_url: str,
) -> Dict[str, Any]:
    """
    Ask Claude to:
      - Look at the scholarship description
      - Use web search / the official scholarship page (scholarship_url)
      - Consider our internal priority weights
      - Evaluate how well the essay fits

    Returns a dict like:
    {
        "score": 87.5,
        "reasoning": "Why this score was given",
        "aligned_priorities": [...],
        "misaligned_priorities": [...]
    }
    """

    weights_json = json.dumps(weights, ensure_ascii=False, indent=2)

    prompt = f"""
You are helping evaluate a scholarship essay.

We have:
- An official scholarship description
- The official scholarship website URL
- Our internal priority weights for what we *think* the scholarship values
- One student's essay

1) Use your web browsing / web search tools to look at the scholarship's
   official website: {scholarship_url}
   Extract what they emphasize: mission, values, type of student, etc.

2) Combine:
   - Scholarship description text
   - Website content
   - The internal weights I give you

3) Give the essay a score from 0 to 100 representing:
   "How strong is this essay for THIS specific scholarship?"

4) Also tell me:
   - Which priorities are well-aligned
   - Which priorities are underrepresented or missing
   - A short explanation in 3–5 sentences

IMPORTANT:
Return STRICT JSON with this structure:

{{
  "score": 0 to 100 number,
  "reasoning": "string explanation",
  "aligned_priorities": ["priority_id", ...],
  "misaligned_priorities": ["priority_id", ...]
}}

Here is the SCHOLARSHIP DESCRIPTION:
\"\"\"{scholarship_description}\"\"\"

Here is our INTERNAL PRIORITY WEIGHT MAP (you can reference these ids):
{weights_json}

Here is the STUDENT ESSAY:
\"\"\"{essay_text}\"\"\"
"""

    raw = await ask_claude(prompt, max_tokens=800)
    result = json.loads(raw)

    # Safety: ensure "score" exists and is a float
    score_val = float(result.get("score", 0.0))
    result["score"] = max(0.0, min(score_val, 100.0))

    return result
