from pydantic import BaseModel
from typing import List, Optional
from ..schemas.user_profile import UserProfileForMatching


class ScholarshipBase(BaseModel):
    id: str
    title: str
    description: str
    value: Optional[str] = None
    deadline: Optional[str] = None
    level_of_study: Optional[str] = None
    legal_status: Optional[str] = None


class MatchedScholarship(ScholarshipBase):
    match_percentage: float


class ScholarshipMatchRequest(BaseModel):
    user: "UserProfileForMatching"
    top_n: Optional[int] = 10


class ScholarshipMatchResponse(BaseModel):
    scholarships: List[MatchedScholarship]


ScholarshipMatchRequest.update_forward_refs()
