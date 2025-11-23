# backend/app/api/routes/weights.py

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from app.core.weights import renormalize_weights


router = APIRouter(prefix="/api/weights", tags=["weights"])


class PriorityIn(BaseModel):
    id: str
    base_weight: float


class ReweightRequest(BaseModel):
    priorities: List[PriorityIn]
    selected_ids: List[str]


class PriorityOut(PriorityIn):
    new_weight: float


@router.post("/reweight", response_model=List[PriorityOut])
async def reweight(req: ReweightRequest):
    """
    Re-distribute weights so that only selected priorities share 100%.
    Unselected ones get 0.
    """
    result = renormalize_weights(
        [p.model_dump() for p in req.priorities],
        req.selected_ids,
    )
    return [PriorityOut(**p) for p in result]
