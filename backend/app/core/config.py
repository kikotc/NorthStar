# backend/app/core/config.py
# backend/app/core/config.py
from dataclasses import dataclass
import os
from dotenv import load_dotenv   # 👈 add this

load_dotenv()  # 👈 load .env file once when module is imported


@dataclass
class Settings:
    backend_env: str
    supabase_url: str | None
    supabase_service_role_key: str | None
    anthropic_api_key: str | None

    @property
    def is_production(self) -> bool:
        return self.backend_env == "prod"

def get_settings() -> Settings:
    return Settings(
        backend_env=os.getenv("BACKEND_ENV", "local"),
        supabase_url=os.getenv("SUPABASE_URL"),
        supabase_service_role_key=os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"),
    )

settings = get_settings()

from dataclasses import dataclass
import os

@dataclass
class Settings:
    backend_env: str
    supabase_url: str | None
    supabase_service_role_key: str | None
    anthropic_api_key: str | None

    @property
    def is_production(self) -> bool:
        return self.backend_env == "prod"

def get_settings() -> Settings:
    return Settings(
        backend_env=os.getenv("BACKEND_ENV", "local"),
        supabase_url=os.getenv("SUPABASE_URL"),
        supabase_service_role_key=os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"),
    )

# 👇 THIS LINE IS CRITICAL
settings = get_settings()
