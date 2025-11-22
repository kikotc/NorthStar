from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .services.claude_services import call_claude  # 👈 import our wrapper

app = FastAPI(
    title="NorthStar API",
    description="Backend for scholarship analysis and essay generation",
    version="0.1.0",
)

app.add_middleware(  # type: ignore[misc]
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

    reply = call_claude(
        system_prompt="You are a friendly assistant helping a hackathon team.",
        user_prompt="Say hi in one short sentence."
    )
    return {"reply": reply}
