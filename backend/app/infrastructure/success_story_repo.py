# backend/app/infrastructure/success_story_repo.py

from __future__ import annotations

from pathlib import Path
from typing import List, Dict, Any, Optional
import json

# Path to the success stories JSON file
_DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "success_stories.json"


def _load_success_stories() -> List[Dict[str, Any]]:
    """Load all success stories from the local JSON file."""
    try:
        with _DATA_PATH.open("r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"[warning] success stories file not found: {_DATA_PATH}")
        return []
    except json.JSONDecodeError:
        print(f"[warning] invalid JSON in success stories file: {_DATA_PATH}")
        return []


def list_success_stories() -> List[Dict[str, Any]]:
    """
    Public function: return all success stories from the JSON file.
    """
    return _load_success_stories()


def find_best_matching_story(priority_weights: Dict[str, float]) -> Optional[Dict[str, Any]]:
    """
    Determine the most compatible success story for a scholarship
    based on shared priorities.

    priority_weights example:
        {
            "academic_excellence": 0.5,
            "leadership": 0.3,
            "community_service": 0.2
        }

    Each success story has:
        "priorities": ["leadership", "resilience", ...]

    Scoring rule:
        sum of scholarship priority weights *matching that story's priorities*

    Returns:
        A single success story dict (the best match),
        or None if no stories match.
    """
    stories = _load_success_stories()
    if not stories or not priority_weights:
        return None

    best_story: Optional[Dict[str, Any]] = None
    best_score: float = -1.0

    for story in stories:
        story_prios = story.get("priorities") or []
        score = sum(priority_weights.get(p, 0.0) for p in story_prios)

        if score > best_score:
            best_score = score
            best_story = story

    return best_story
