from asyncpg import Connection
from fastapi import APIRouter, Depends, HTTPException, status

from app.db.db import get_db_connection
from app.repositories.user_repo import UserRepository
from app.schema.user_schema import User, UserBase

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user_data: UserBase, conn: Connection = Depends(get_db_connection)):
    """Create new user route"""
    repo = UserRepository(conn)

    # Check if user already exists
    if await repo.exists_by_telegram_id(user_data.telegram_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with the same telegram id already registered",
        )

    user = await repo.create(user_data)
    return user


@router.get("/", response_model=list[User])
async def get_users(skip: int = 0, limit: int = 100, conn: Connection = Depends(get_db_connection)):
    """Get all users with pagination"""
    repo = UserRepository(conn)
    users = await repo.get_all(skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=User)
async def get_user(user_id: int, conn: Connection = Depends(get_db_connection)):
    """Get user by id"""
    repo = UserRepository(conn)
    user = await repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.get("/{telegram_id}", response_model=User)
async def get_user_by_telegram_id(telegram_id: int, conn: Connection = Depends(get_db_connection)):
    """Get user by telegram id"""
    repo = UserRepository(conn)
    user = await repo.get_by_telegram_id(telegram_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
