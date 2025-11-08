import asyncio
import logging
import os
from typing import Any

import httpx
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Bot configuration
BOT_TOKEN = os.getenv("BOT_TOKEN")
BASE_URL = os.getenv("BASE_URL", "https://api.example.com")

# Validate required environment variables
if not BOT_TOKEN:
    raise ValueError("BOT_TOKEN environment variable is not set")


async def send_post_request(user_data: dict[str, Any]) -> dict[str, Any] | None:
    """
    Send POST request to the API endpoint.

    Args:
        user_data: Dictionary containing user information

    Returns:
        Response data from the API or None if request failed
    """
    endpoint = f"{BASE_URL}/api/users"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                endpoint,
                json=user_data,
                timeout=10.0
            )
            response.raise_for_status()
            logger.info(f"POST request successful: {response.status_code}")
            return response.json()
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
    except httpx.RequestError as e:
        logger.error(f"Request error occurred: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error occurred: {str(e)}")

    return None


async def start_handler(message: types.Message) -> None:
    """
    Handle /start command.

    Sends user information via POST request and responds to the user.
    """
    user = message.from_user

    # Prepare user data
    user_data = {
        "user_id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "language_code": user.language_code,
    }

    # Send POST request
    logger.info(f"User {user.id} started the bot")
    response_data = await send_post_request(user_data)

    # Respond to user
    if response_data:
        await message.answer(
            f"Welcome, {user.first_name}!\n\n"
            f"Your information has been successfully registered."
        )
    else:
        await message.answer(
            f"Welcome, {user.first_name}!\n\n"
            f"There was an issue registering your information. Please try again later."
        )


async def main() -> None:
    """
    Main function to start the bot.
    """
    # Initialize bot and dispatcher
    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher()

    # Register handlers
    dp.message.register(start_handler, Command("start"))

    # Start polling
    logger.info("Bot started")
    try:
        await dp.start_polling(bot)
    finally:
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())
