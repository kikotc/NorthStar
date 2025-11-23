# backend/app/infrastructure/ai_client.py

from anthropic import Anthropic
from ..core.config import settings


# Create the Anthropic client once
_anthropic_client = None

# Set your model name (use the one from your dashboard or default)
MODEL_NAME = "claude-sonnet-4-5-20250929"  # Safer default than a dated version


def get_claude_client() -> Anthropic:
    """
    Return a globally reused Anthropic client.
    If it doesn't exist yet, build it using the API key from settings.
    """
    global _anthropic_client

    if _anthropic_client is None:
        api_key = settings.anthropic_api_key
        if not api_key:
            raise RuntimeError("Missing Anthropic API key! Check your .env and settings config.")
        _anthropic_client = Anthropic(api_key=api_key)

    return _anthropic_client


async def ask_claude(prompt: str, max_tokens: int = 800) -> str:
    """
    A simple helper that wraps messages.create() for single-shot prompt use cases.
    Keeps it for lightweight calls if needed.
    """
    client = get_claude_client()

    resp = client.messages.create(
        model=MODEL_NAME,
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}]
    )

    blocks = [block.text for block in resp.content if block.type == "text"]
    return "\n".join(blocks)
