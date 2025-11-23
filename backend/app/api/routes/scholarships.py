# backend/app/api/routes/scholarships.py

from fastapi import APIRouter, HTTPException

from app.infrastructure.scholarship_repo import (
    list_scholarships,
    get_scholarship,
)
from app.core.scholarship_analysis import analyze_scholarship_priorities

router = APIRouter(
    prefix="/api/scholarships",
    tags=["scholarships"],
)


@router.get("/", summary="List all scholarships")
def list_all_scholarships():
    """Return all scholarships from the local JSON file."""
    return list_scholarships()


@router.get("/{scholarship_id}", summary="Get one scholarship by id")
def get_scholarship_by_id(scholarship_id: str):
    """
    Fetch a single scholarship (no AI, just JSON lookup).
    scholarship_id should match the 'id' field (we compare as strings).
    """
    s = get_scholarship(scholarship_id)
    if not s:
        raise HTTPException(
            status_code=404,
            detail=f"Scholarship {scholarship_id} not found",
        )
    return s


@router.get("/{scholarship_id}/analysis", summary="AI analysis of scholarship priorities")
async def scholarship_analysis(scholarship_id: str):
    """
    Use Claude + winner stories to produce a priorities/weights analysis.
    We catch ValueError from the core function and turn it into 404 instead
    of a 500 Internal Server Error.
    """
    try:
        analysis = await analyze_scholarship_priorities(scholarship_id)
        return analysis
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
