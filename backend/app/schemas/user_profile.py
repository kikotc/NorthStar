from pydantic import BaseModel
from typing import List, Optional


class UserCoreInfo(BaseModel):
    full_name: str
    university: str
    program_of_study: str
    year: int
    is_domestic: bool            # derived from that checklist
    ethnicity: Optional[str] = None  # optional, you can ignore in matching if you want


class UserExtraInfo(BaseModel):
    experiences: List[str] = []  # free-text entries from the form
    interests: List[str] = []
    awards: List[str] = []


class UserProfileForMatching(BaseModel):
    """
    This is what the backend needs to compute match %.
    Frontend can build this object after the user finishes both pages.
    """
    core: UserCoreInfo
    extra: UserExtraInfo
