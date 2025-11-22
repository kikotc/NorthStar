# backend/app/infrastructure/ai_client.py

from anthropic import Anthropic
from ..core.config import settings


# Create a single Anthropic client using your API key from config
anthropic = Anthropic(api_key=settings.anthropic_api_key)


async def ask_claude(prompt: str, max_tokens: int = 1024) -> str:
    """
    Send a single user prompt to Claude and return the text response.

    Usage from other files:
        from infrastructure.ai_client import ask_claude
        text = await ask_claude("hello")
    """
    resp = anthropic.messages.create(
        model="claude-3-5-sonnet-latest",
        max_tokens=max_tokens,
        messages=[
            {"role": "user", "content": prompt}
        ],
    )

    # Extract plain text blocks from the response
    texts = [block.text for block in resp.content if block.type == "text"]
    return "\n".join(texts)
