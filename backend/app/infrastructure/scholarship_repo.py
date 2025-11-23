# backend/app/infrastructure/scholarship_repo.py

import json
from pathlib import Path
from functools import lru_cache
from typing import List, Dict, Optional

# Adjust this path if your structure is slightly different
BASE_DIR = Path(__file__).resolve().parent.parent  # points to backend/app
DATA_DIR = BASE_DIR / "data"

SCHOLARSHIPS_FILE = DATA_DIR / "scholarships.json"
WINNER_STORIES_FILE = DATA_DIR / "winner_stories.json"


@lru_cache(maxsize=1)
def _load_scholarships() -> List[Dict]:
    with open(SCHOLARSHIPS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@lru_cache(maxsize=1)
def _load_winner_stories() -> List[Dict]:
    with open(WINNER_STORIES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def get_scholarship(scholarship_id: str) -> Optional[Dict]:
    """Return a single scholarship dict or None."""
    for s in _load_scholarships():
        if s.get("id") == scholarship_id:
            return s
    return None


def list_scholarships() -> List[Dict]:
    """Return all scholarships."""
    return _load_scholarships()


def get_winner_stories_for_scholarship(scholarship_id: str) -> List[Dict]:
    """Return winner stories linked to a scholarship_id."""
    return [
        w
        for w in _load_winner_stories()
        if w.get("scholarship_id") == scholarship_id
    ]
