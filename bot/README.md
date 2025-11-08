# Telegram Bot

A Telegram bot built with aiogram that handles the `/start` command and sends user data via POST request.

## Requirements

- Python 3.13+
- Poetry

## Setup

1. Install dependencies:
```bash
poetry install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Edit `.env` and add your configuration:
   - `BOT_TOKEN`: Get your bot token from [@BotFather](https://t.me/BotFather) on Telegram
   - `BASE_URL`: Set your API endpoint base URL

## Running the Bot

```bash
poetry run python main.py
```

## Features

- Handles `/start` command
- Sends user information to the configured API endpoint via POST request
- User data includes:
  - User ID
  - Username
  - First name
  - Last name
  - Language code

## API Endpoint

The bot sends POST requests to `{BASE_URL}/api/users` with the following JSON structure:

```json
{
  "user_id": 123456789,
  "username": "example_user",
  "first_name": "John",
  "last_name": "Doe",
  "language_code": "en"
}
```
