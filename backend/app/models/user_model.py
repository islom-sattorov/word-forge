from dataclasses import dataclass
from datetime import datetime
from typing import Self


@dataclass
class UserModel:
    """Database model representing a user record."""

    id: int
    telegram_id: int
    username: str
    created_at: datetime | None = None
    updated_at: datetime | None = None

    @classmethod
    def from_record(cls, record: dict | None) -> Self | None:
        """Create UserModel instance from database record."""
        if record is None:
            return None
        return cls(
            id=record["id"],
            telegram_id=record["telegram_id"],
            username=record["username"],
            created_at=record["created_at"],
            updated_at=record["updated_at"],
        )
