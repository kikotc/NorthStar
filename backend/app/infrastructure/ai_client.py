# backend/app/infrastructure/ai_client.py

from anthropic import Anthropic
from ..core.config import settings  # note: 'app.core' not '..core' when imported from main

# Create a single Anthropic client using your API key from config
anthropic = Anthropic(api_key=settings.anthropic_api_key)

# Use the model name shown in your Anthropic dashboard
MODEL_NAME = "claude-sonnet-4-5-20250929"


async def ask_claude(prompt: str, max_tokens: int = 1024) -> str:
    """
    Send a single user prompt to Claude and return the text response.
    """
    # Synchronous client inside async fn is ok for hackathon
    resp = anthropic.messages.create(
        model=MODEL_NAME,
        max_tokens=max_tokens,
        messages=[
            {"role": "user", "content": prompt}
        ],
    )

    # Extract plain text blocks from the response
    texts = [block.text for block in resp.content if block.type == "text"]
    return "\n".join(texts)
