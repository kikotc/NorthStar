# claude_services.py (example)
from anthropic import Anthropic
from app.core.config import settings

client = Anthropic(api_key=settings.anthropic_api_key)

def call_claude(messages: list[dict]) -> str:
    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=256,
        messages=messages,
    )
    return response.content[0].text
