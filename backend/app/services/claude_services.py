# app/services/claude_service.py
from anthropic import Anthropic
from app.core.config import settings


client = Anthropic(api_key=settings.claude_api_key)


def call_claude(messages: list[dict], model: str = "claude-3-sonnet-20240229"):
    """
    Wrapper for calling Claude to keep code clean.
    Expects a list of messages:
    [
      {"role": "user", "content": "Hello"},
      {"role": "assistant", "content": "..."}
    ]
    """
    response = client.messages.create(
        model=model,
        max_tokens=800,
        messages=messages
    )

    # Combine all text blocks into a single string
    return "".join(
        block.text for block in response.content if block.type == "text"
    )
