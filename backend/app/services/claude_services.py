from typing import List, Literal, TypedDict

from app.infrastructure.ai_client import get_claude_client

# Claude only accepts these three roles
ClaudeRole = Literal["user", "assistant", "system"]

class ClaudeMessage(TypedDict):
    role: ClaudeRole
    content: str

DEFAULT_MODEL = "claude-3-sonnet-20240229"

def call_claude(
    messages: List[ClaudeMessage],
    model: str = DEFAULT_MODEL,
    max_tokens: int = 800,
) -> str:
    """
    Wrapper around Anthropic's messages.create API.

    - `messages` should look like:
      [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Write me a 200-word bio."}
      ]

    - Returns a single concatenated text string from Claude's response.
    """
    client = get_claude_client()

    response = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        messages=messages,
    )

    # Anthropic returns a list of content blocks.
    # We join all the text blocks together into one string.
    return "".join(
        block.text for block in response.content if getattr(block, "type", None) == "text"
    )


def make_user_message(text: str) -> ClaudeMessage:
    return {"role": "user", "content": text}


def make_system_message(text: str) -> ClaudeMessage:
    return {"role": "system", "content": text}


def make_assistant_message(text: str) -> ClaudeMessage:
    return {"role": "assistant", "content": text}