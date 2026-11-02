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
    GEMINI_MODEL: str = "gemini-2.5-flash"

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

    # Database
    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'ghost_qa.db'}"

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
