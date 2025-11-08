from collections.abc import AsyncIterator
from pathlib import Path

import asyncpg

from app.config import get_settings

settings = get_settings()


class Database:
    """Database connection manager for async PostgreSQL operations."""

    pool: asyncpg.Pool | None = None

    @classmethod
    async def connect(cls) -> None:
        """Create database connection pool."""
        if cls.pool is None:
            cls.pool = await asyncpg.create_pool(
                dsn=settings.database_url,
                min_size=5,
                max_size=20,
                command_timeout=60,
            )
            print("Database pool created successfully")

    @classmethod
    async def disconnect(cls) -> None:
        """Close database connection pool."""
        if cls.pool is not None:
            await cls.pool.close()
            cls.pool = None
            print("Database pool closed")

    @classmethod
    async def get_connection(cls) -> asyncpg.Connection:
        """Get a connection from the pool."""
        if cls.pool is None:
            await cls.connect()
        return await cls.pool.acquire()

    @classmethod
    async def release_connection(cls, connection: asyncpg.Connection) -> None:
        """Release a connection back to the pool."""
        if cls.pool is not None:
            await cls.pool.release(connection)


async def get_db_connection() -> AsyncIterator[asyncpg.Connection]:
    """Dependency for getting database connection in routes."""
    connection = await Database.get_connection()
    try:
        yield connection
    finally:
        await Database.release_connection(connection)


async def init_db() -> None:
    """Initialize database schema from migration file."""
    try:
        conn = await Database.get_connection()
        try:
            schema_path = Path("app/migrations/schema.sql")
            schema_sql = schema_path.read_text(encoding="utf-8")

            await conn.execute(schema_sql)
            print("Database migration initialized successfully")

        finally:
            await Database.release_connection(conn)
    except Exception as err:
        print(f"MIGRATION ERROR: {err}")
        raise
