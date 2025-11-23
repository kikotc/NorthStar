# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .infrastructure.ai_client import ask_claude

from .api.routes.weights import router as weights_router
from .api.routes.scholarships import router as scholarships_router
from .api.routes.essays import router as essays_router


app = FastAPI(
    title="NorthStar API",
    description="Backend for scholarship analysis and essay generation",
    version="0.1.0",
)

# CORS (hackathon-friendly: allow everything)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers ONCE
app.include_router(weights_router)
app.include_router(scholarships_router)
app.include_router(essays_router)


@app.get("/health")
async def health_check() -> dict:
    return {
        "status": "ok",
        "env": settings.backend_env,
        "supabase_configured": settings.supabase_url is not None,
        "claude_configured": settings.anthropic_api_key is not None,
    }


@app.get("/api/debug/claude")
async def debug_claude() -> dict:
    """
    Quick test route to confirm Claude is wired up.
    """
    if not settings.anthropic_api_key:
        return {"error": "ANTHROPIC_API_KEY is not set"}

    reply = await ask_claude("Say hi to the NorthStar hackathon team in one short sentence.")
    return {"reply": reply}
