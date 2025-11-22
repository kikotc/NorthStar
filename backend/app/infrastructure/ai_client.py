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