from datetime import UTC, datetime

from asyncpg.connection import Connection

from app.models.user_model import UserModel
from app.schema.user_schema import UserBase


class UserRepository:
    """Repository pattern for User database operations."""

    def __init__(self, connection: Connection) -> None:
        self.conn: Connection = connection

    async def create(self, user: UserBase) -> UserModel | None:
        """Create a new user in database."""
        query = """
            INSERT INTO users (username, telegram_id, created_at, updated_at)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        """

        now = datetime.now(UTC)
        record = await self.conn.fetchrow(query, user.username, user.telegram_id, now, now)
        return UserModel.from_record(record)

    async def get_by_id(self, user_id: int) -> UserModel | None:
        """Get user by id."""
        query = "SELECT * FROM users WHERE id = $1"
        record = await self.conn.fetchrow(query, user_id)
        return UserModel.from_record(record)

    async def get_by_telegram_id(self, telegram_id: int) -> UserModel | None:
        """Get user by telegram id."""
        query = "SELECT * FROM users WHERE telegram_id = $1"
        record = await self.conn.fetchrow(query, telegram_id)
        return UserModel.from_record(record)

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[UserModel]:
        """Get all users with pagination."""
        query = """
            SELECT * FROM users
            ORDER BY created_at DESC
            OFFSET $1 LIMIT $2
        """
        records = await self.conn.fetch(query, skip, limit)
        return [UserModel.from_record(record) for record in records]

    async def exists_by_telegram_id(self, telegram_id: int) -> bool:
        """Check if user exists by telegram id."""
        query = "SELECT EXISTS(SELECT 1 FROM users WHERE telegram_id = $1)"
        return await self.conn.fetchval(query, telegram_id)
