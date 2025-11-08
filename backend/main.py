from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import get_settings
from app.db.db import Database, init_db

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Application lifespan events."""
    # Startup
    print(f"Starting {settings.app_name} v{settings.app_version}")
    await Database.connect()
    await init_db()
    yield
    # Shutdown
    print("Shutting down application")
    await Database.disconnect()


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="WordForge API - Learn English vocabulary and irregular verbs",
    lifespan=lifespan,
    debug=settings.debug,
)


@app.get("/")
async def root() -> dict[str, str]:
    """Root endpoint."""
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": settings.app_version,
        "docs": "/docs",
    }


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy", "app": settings.app_name, "version": settings.app_version}
