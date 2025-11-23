# backend/app/core/weights.py

from typing import List, Dict


def renormalize_weights(priorities: List[Dict], selected_ids: List[str]) -> List[Dict]:
    """
    Re-distribute weights so that only selected priorities share 100%.

    priorities example:
      [
        {"id": "academic_excellence", "base_weight": 80},
        {"id": "research_plan", "base_weight": 75},
        {"id": "community_service", "base_weight": 40}
      ]

    selected_ids example:
      ["academic_excellence", "research_plan"]

    Result:
      - academic_excellence: (80 / (80+75)) * 100 ≈ 51.61
      - research_plan:       (75 / (80+75)) * 100 ≈ 48.39
      - community_service:   0
    """

    selected_set = set(selected_ids)
    selected_priorities = [p for p in priorities if p["id"] in selected_set]

    # If nothing is selected, just keep base weights as new_weight
    if not selected_priorities:
        return [{**p, "new_weight": float(p["base_weight"])} for p in priorities]

    total = sum(float(p["base_weight"]) for p in selected_priorities)

    # Avoid division by 0: if all base weights are 0, split equally
    if total == 0:
        equal = 100.0 / len(selected_priorities)
        new_weights = {p["id"]: equal for p in selected_priorities}
    else:
        new_weights = {
            p["id"]: (float(p["base_weight"]) / total) * 100.0
            for p in selected_priorities
        }

    result: List[Dict] = []
    for p in priorities:
        pid = p["id"]
        result.append({
            **p,
            "new_weight": round(new_weights.get(pid, 0.0), 2),
        })
    return result
