from datetime import datetime

from pydantic import BaseModel, Field


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    telegram_id: int = Field(...)


class UserUpdate(BaseModel):
    username: str | None = Field(None, min_length=3, max_length=50)
    created_at: datetime
    updated_at: datetime


class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
