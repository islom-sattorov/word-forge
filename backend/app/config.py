from functools import lru_cache
from os import getenv
from typing import Final

from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    def __init__(self) -> None:
        self.admin_id: int = int(getenv("ADMIN_ID", default="0"))
        self.database_url: str = getenv("DATABASE_URL", default="")
        self.sync_database_url: str = getenv("DATABASE_URL_SYNC", default="")
        self.app_name: Final[str] = "Word forge"
        self.app_version: Final[str] = "0.0.0"
        self.debug: bool = True


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
