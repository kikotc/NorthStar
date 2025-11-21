# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title="NorthStar API",
    description="Backend for scholarship analysis and essay generation",
    version="0.1.0",
)

# Enable CORS so frontend can call backend during dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check() -> dict:
    """Verify backend is running and env config is loading."""
    return {
        "status": "ok",
        "env": settings.backend_env,
        "supabase_configured": settings.supabase_url is not None,
        "claude_configured": settings.anthropic_api_key is not None,
    }
