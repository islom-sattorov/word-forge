# Telegram Mini App Setup Guide

## Problem: Empty initDataUnsafe

If `window.Telegram.WebApp` exists but `initDataUnsafe` is empty, it means your app is **not being launched properly** from Telegram. User data is ONLY available when the app is launched through a Telegram bot with proper authorization.

## How to Properly Launch a Telegram Mini App

### Step 1: Create/Configure Your Telegram Bot

1. Open [@BotFather](https://t.me/botfather) in Telegram
2. If you don't have a bot, create one with `/newbot`
3. Get your bot token (you'll need it)

### Step 2: Set Up Mini App in BotFather

There are two ways to launch a Mini App:

#### Option A: Menu Button (Recommended for standalone apps)
```
1. Go to @BotFather
2. Send: /mybots
3. Select your bot
4. Choose: Bot Settings → Menu Button
5. Configure Menu Button URL
6. Enter your ngrok URL: https://penultimately-apocatastatic-eloise.ngrok-free.dev
```

#### Option B: Web App in Messages (Recommended for chat-based apps)
```
1. Go to @BotFather
2. Send: /newapp
3. Select your bot
4. Enter app details (name, description, photo)
5. Enter Web App URL: https://penultimately-apocatastatic-eloise.ngrok-free.dev
```

### Step 3: Launch the App

#### If using Menu Button:
1. Open your bot in Telegram
2. Tap the **Menu Button** (bottom left, next to message input)
3. Your Mini App will launch with full user data

#### If using /newapp:
1. Open your bot
2. Send a message or use a keyboard button with `web_app` type
3. Example keyboard button JSON:
```json
{
  "text": "Open WordForge",
  "web_app": {"url": "https://your-ngrok-url.ngrok-free.dev"}
}
```

### Step 4: Verify User Data

Once properly launched, check browser console. You should see:

```
🔍 Telegram WebApp Debugging
  ✅ Telegram WebApp found
  📱 Platform: ios (or android, web, etc.)
  🔗 InitData (raw): user=...&hash=... (long string)
  📦 InitDataUnsafe: {user: {id: 123456, first_name: "Your Name", ...}}
  👤 User from initDataUnsafe: {id: 123456, first_name: "Your Name", ...}
  ✅ Telegram integration successful with user data
```

## Common Issues

### Issue 1: initDataUnsafe is Empty
**Cause**: App opened directly in browser or via link, not through bot
**Solution**: Always launch through bot's Menu Button or web_app keyboard

### Issue 2: "403 Forbidden" or CORS errors
**Cause**: Telegram can't access your URL
**Solution**:
- Make sure ngrok tunnel is running: `ngrok http 5173`
- Update BotFather with current ngrok URL
- Ensure vite.config.ts has correct ngrok hostname

### Issue 3: Old data cached
**Cause**: Telegram caches the app
**Solution**:
- Close and reopen the bot
- Clear Telegram cache (Settings → Data and Storage → Clear Cache)

## Development Workflow

1. **Start dev server:**
   ```bash
   bun run dev
   ```

2. **Start ngrok tunnel:**
   ```bash
   ngrok http 5173
   ```

3. **Update bot URL in BotFather** (if ngrok URL changed)

4. **Launch from bot**, not directly from browser

5. **Check console logs** for user data

## Testing Without Telegram (Development Mode)

For local development without Telegram, the app falls back to "Guest" user. This is expected behavior and allows you to work on features without constantly launching through Telegram.

## Helpful Bot Commands

Create a bot that responds to `/start` with a Mini App button:

```python
# Example bot code (Python with python-telegram-bot)
from telegram import Update, WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import Application, CommandHandler

async def start(update: Update, context):
    keyboard = [[KeyboardButton(
        text="🚀 Open WordForge",
        web_app=WebAppInfo(url="https://your-ngrok-url.ngrok-free.dev")
    )]]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    await update.message.reply_text(
        "Welcome! Tap the button below to launch WordForge:",
        reply_markup=reply_markup
    )

app = Application.builder().token("YOUR_BOT_TOKEN").build()
app.add_handler(CommandHandler("start", start))
app.run_polling()
```

## Debug Checklist

- [ ] Bot created in @BotFather
- [ ] Mini App URL configured in BotFather (Menu Button or /newapp)
- [ ] Dev server running (`bun run dev`)
- [ ] Ngrok tunnel running and URL matches BotFather config
- [ ] App launched FROM BOT, not direct browser link
- [ ] Browser console shows user data in initDataUnsafe
- [ ] No CORS or network errors in console

## Next Steps

Once user data appears:
1. Username will show in app header
2. Profile photo will display (if set)
3. Theme will match Telegram dark/light mode
4. User data will persist in localStorage
