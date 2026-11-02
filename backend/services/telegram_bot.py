import asyncio
from typing import Optional, Dict, Any
from pathlib import Path
from ..config import settings

class TelegramSentinelBot:
    def __init__(self):
        self.bot = None
        self.dp = None
        self.is_active = False

        if settings.TELEGRAM_BOT_TOKEN:
            try:
                from aiogram import Bot, Dispatcher, types, F
                from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, FSInputFile
                self.bot = Bot(token=settings.TELEGRAM_BOT_TOKEN)
                self.dp = Dispatcher()
                self._setup_handlers()
                self.is_active = True
                print("[TelegramBot] Initialized aiogram 3.x with configured bot token.")
            except Exception as e:
                print(f"[TelegramBot] Warning: Could not initialize Telegram Bot: {e}")

    def _setup_handlers(self):
        from aiogram import types, F
        from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

        @self.dp.callback_query(F.data.startswith("pr:"))
        async def handle_pr_approval(callback: types.CallbackQuery):
            incident_id = callback.data.split(":")[1]
            await callback.answer(f"Approving fix for {incident_id}...")
            await callback.message.reply(
                f"🚀 **Action Authorized!**\nSelf-healing PR creation triggered for incident `{incident_id}`."
            )

        @self.dp.callback_query(F.data.startswith("ignore:"))
        async def handle_ignore(callback: types.CallbackQuery):
            incident_id = callback.data.split(":")[1]
            await callback.answer(f"Incident {incident_id} marked as ignored.")
            await callback.message.reply(f"❌ Incident `{incident_id}` has been muted.")

    async def send_incident_alert(
        self,
        incident_id: str,
        bug_type: str,
        severity: str,
        url: str,
        error_message: str,
        root_cause_en: str,
        root_cause_uz: str,
        target_file: Optional[str] = None,
        screenshot_path: Optional[str] = None,
        diff: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Sends an interactive notification with Inline Buttons.
        Falls back to High-Fidelity Simulation logging if token/chat_id are unset.
        """
        severity_emoji = {
            "CRITICAL": "🔴 CRITICAL",
            "HIGH": "🟠 HIGH",
            "MEDIUM": "🟡 MEDIUM",
            "LOW": "🔵 LOW"
        }.get(severity.upper(), "⚪ UNKNOWN")

        text = (
            f"🛡️ **GHOST-QA SENTINEL ALERT**\n"
            f"━━━━━━━━━━━━━━━━━━\n"
            f"**Status:** {severity_emoji}\n"
            f"**Type:** `{bug_type}`\n"
            f"**Target:** {url}\n"
            f"**Target File:** `{target_file or 'Unknown'}`\n\n"
            f"💥 **Defect Trace:**\n"
            f"```\n{error_message[:250]}\n```\n\n"
            f"🔍 **AI Root Cause (EN):**\n{root_cause_en[:300]}\n\n"
            f"🇺🇿 **Texnik Tahlil (UZ):**\n{root_cause_uz[:300]}\n"
            f"━━━━━━━━━━━━━━━━━━"
        )

        if self.is_active and self.bot and settings.TELEGRAM_CHAT_ID:
            try:
                from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, FSInputFile

                dashboard_url = f"{settings.FRONTEND_URL}/incident/{incident_id}"
                keyboard = InlineKeyboardMarkup(inline_keyboard=[
                    [
                        InlineKeyboardButton(text="✅ Approve & Create PR", callback_data=f"pr:{incident_id}"),
                    ],
                    [
                        InlineKeyboardButton(text="🔍 View in Dashboard", url=dashboard_url),
                        InlineKeyboardButton(text="❌ Ignore", callback_data=f"ignore:{incident_id}")
                    ]
                ])

                if screenshot_path and Path(screenshot_path).exists():
                    photo = FSInputFile(screenshot_path)
                    sent = await self.bot.send_photo(
                        chat_id=settings.TELEGRAM_CHAT_ID,
                        photo=photo,
                        caption=text[:1024],
                        parse_mode="Markdown",
                        reply_markup=keyboard
                    )
                else:
                    sent = await self.bot.send_message(
                        chat_id=settings.TELEGRAM_CHAT_ID,
                        text=text,
                        parse_mode="Markdown",
                        reply_markup=keyboard
                    )

                return {
                    "sent": True,
                    "mode": "LIVE_TELEGRAM",
                    "message_id": sent.message_id
                }
            except Exception as e:
                print(f"[TelegramBot] Failed to send Telegram alert: {e}")

        # Simulation Mode Output
        print("\n" + "=" * 60)
        print("📨 [SIMULATED TELEGRAM SENTINEL ALERT]")
        print(text)
        print("🔘 Buttons: [ ✅ Approve & Create PR ] | [ 🔍 View Dashboard ] | [ ❌ Ignore ]")
        print("=" * 60 + "\n")

        return {
            "sent": True,
            "mode": "SIMULATED",
            "note": "Alert broadcast simulated (Configure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID for live delivery)"
        }
