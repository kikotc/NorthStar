from pydantic import BaseModel
from typing import List, Optional


class WinnerStoryStyleProfile(BaseModel):
    hook_style: Optional[str] = None
    tone: Optional[str] = None
    voice_notes: Optional[str] = None
    emotional_pacing: Optional[str] = None
    structure_notes: Optional[str] = None  # NEW (optional)


class WinnerStory(BaseModel):
    id: str

    scholarship_id: str
    scholarship_name: str

    recipient_name: str
    role_or_program: Optional[str] = None
    year: Optional[int] = None

    story_paragraphs: List[str]
    source: Optional[str] = None

    priorities: List[str] = []  # Used for matching
    style_profile: Optional[WinnerStoryStyleProfile] = None

    # Helper property
    def full_text(self) -> str:
        return "\n\n".join(self.story_paragraphs)
