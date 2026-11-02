import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import Optional

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    FRONTEND_URL: str = "http://localhost:3000"

    # AI Diagnostic & Self-Healing
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-3.8-flash"

    # GitHub Integration
    GITHUB_TOKEN: Optional[str] = None
    GITHUB_REPO: Optional[str] = "f-1331/Ghost-QA-Sentinel"
    GITHUB_DEFAULT_OWNER: Optional[str] = "f-1331"
    GITHUB_DEFAULT_REPO: Optional[str] = "Ghost-QA-Sentinel"

    # Telegram Bot
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    TELEGRAM_CHAT_ID: Optional[str] = None
    TELEGRAM_ACCOUNT: Optional[str] = "@fayzbek1331"

    # Simulation Mode
    SIMULATION_MODE: bool = True

    # Database (Supports Neon Serverless PostgreSQL or local SQLite)
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{str(BASE_DIR / 'ghost_qa.db').replace(chr(92), '/')}")
    DATABASE_PROVIDER: str = "Neon Tech PostgreSQL (Serverless)"

    @property
    def database_provider(self) -> str:
        return self.DATABASE_PROVIDER
    
    # Neon Serverless Services
    NEON_BRANCH: Optional[str] = os.getenv("NEON_BRANCH", "production")
    NEON_AUTH_BASE_URL: Optional[str] = os.getenv("NEON_AUTH_BASE_URL")
    NEON_AUTH_JWKS_URL: Optional[str] = os.getenv("NEON_AUTH_JWKS_URL")
    NEON_REALTIME_URL: Optional[str] = os.getenv("NEON_REALTIME_URL")
    NEON_REALTIME_SECRET: Optional[str] = os.getenv("NEON_REALTIME_SECRET")

    # Storage paths
    SCREENSHOTS_DIR: Path = BASE_DIR / "backend" / "screenshots"
    DEMO_APP_DIR: Path = BASE_DIR / "demo-broken-app"

    class Config:
        env_file = str(BASE_DIR / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()

# Ensure screenshot directory exists
settings.SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
