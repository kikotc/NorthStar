from typing import Optional

from anthropic import Anthropic
from app.core.config import settings

_claude_client: Optional[Anthropic] = None

def get_claude_client() -> Anthropic:
    """
    Return a configured Claude client.

    - Reads the API key from settings.anthropic_api_key
    - Raises a clear error if the key is missing
    """
    global _claude_client

    if _claude_client is None:
        api_key = settings.anthropic_api_key
        if not api_key:
            raise RuntimeError(
                "ANTHROPIC_API_KEY is not set. "
                "Add it to your backend .env file and restart the app."
            )

        _claude_client = Anthropic(api_key=api_key)

    return _claude_client

def ask_claude(
    prompt: str,
    *,
    model: str = "claude-3-5-sonnet-latest",
    max_tokens: int = 1024,
) -> str:
    """
    Send a single user prompt to Claude and return the text response.

    Usage from other files:
        from infrastructure.ai_client import ask_claude
        text = await ask_claude("hello")
    """
    client = get_claude_client()

    resp = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}],
    )

    # Extract only text blocks from the response
    return "".join(
        block.text for block in resp.content if getattr(block, "type", None) == "text"
    )
