from pydantic import BaseModel
from typing import Dict, List, Optional


class EssayGenerateIn(BaseModel):
    profile_id: str
    scholarship_id: str
    selected_priorities: Optional[List[str]] = None
    custom_weights: Optional[Dict[str, float]] = None
    num_variants: int = 1


class EssayDraftOut(BaseModel):
    id: str
    text: str
    focus_priority: Optional[str] = None
    winner_story_id: Optional[str] = None
    winner_story_priorities: Optional[List[str]] = None
    score: Optional[float] = None
    score_breakdown: Optional[Dict[str, float]] = None


class EssayGenerateOut(BaseModel):
    profile_id: str
    scholarship_id: str
    final_weights: Dict[str, float]
    winner_story_id: Optional[str] = None
    winner_story_priorities: Optional[List[str]] = None
    drafts: List[EssayDraftOut]
