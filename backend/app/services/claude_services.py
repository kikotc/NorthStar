# app/services/claude_service.py
from typing import Literal

from app.infrastructure.ai_client import get_claude_client

ClaudeRole = Literal["user", "assistant", "system"]

def call_claude(messages: list[dict], model: str = "claude-3-sonnet-20240229", max_tokens: int = 800):
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
        max_tokens=max_tokens,
        messages=messages
    )

    # Combine all text blocks into a single string
    return "".join(
        block.text for block in response.content if block.type == "text"
    )
