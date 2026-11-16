# render_failback_watchdog.py
# Bi-directional High-Availability (HA) Auto-Failover & Failback Watchdog
# for Ghost-QA Sentinel (Render <-> Cloudflare Tunnel / Local PC)

import argparse
import asyncio
import json
import logging
import os
import re
import subprocess
import sys
import time
from pathlib import Path
import httpx

# Configure UTF-8 stdout on Windows
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | ha_watchdog : %(message)s"
)
logger = logging.getLogger("ha_watchdog")

BASE_DIR = Path(__file__).resolve().parent
RENDER_URL = "https://ghost-qa-sentinel-api.onrender.com"
RENDER_HEALTH_URL = f"{RENDER_URL}/api/health"
LOCAL_PORT = 8001
LOCAL_HEALTH_URL = f"http://127.0.0.1:{LOCAL_PORT}/api/health"
OWNER_TELEGRAM_ID = 6707839718
CHECK_INTERVAL_SECONDS = 90  # 90-second cadence
STATE_FILE = BASE_DIR / "failover_state.json"
VERCEL_JSON = BASE_DIR / "vercel.json"


def get_telegram_token() -> str:
    """Extracts Telegram bot token from .env or backend.config."""
    try:
        from backend.config import settings
        if settings.TELEGRAM_BOT_TOKEN:
            return settings.TELEGRAM_BOT_TOKEN
    except Exception:
        pass

    env_path = BASE_DIR / ".env"
    if env_path.exists():
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.startswith("TELEGRAM_BOT_TOKEN="):
                        return line.split("=", 1)[1].strip()
        except Exception:
            pass

    return "9052180537:AAEVzSC6L3qzL8g3wvvNcAbxe5fP5DUL9ao"


def load_state() -> dict:
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "current_target": "UNKNOWN",
        "render_fail_count": 0,
        "render_success_count": 0,
        "last_switch_time": None,
        "last_tunnel_url": None
    }


def save_state(state: dict):
    try:
        with open(STATE_FILE, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2)
    except Exception as e:
        logger.warning(f"Could not save failover_state.json: {e}")


def get_current_vercel_target() -> str:
    if not VERCEL_JSON.exists():
        return "UNKNOWN"
    try:
        with open(VERCEL_JSON, "r", encoding="utf-8") as f:
            content = f.read()
        if "ghost-qa-sentinel-api.onrender.com" in content:
            return "RENDER"
        elif "trycloudflare.com" in content:
            return "TUNNEL"
    except Exception:
        pass
    return "UNKNOWN"


def get_active_tunnel_url() -> str:
    from tunnel_runner import get_saved_tunnel_url, get_quick_tunnel
    url = get_saved_tunnel_url()
    if url:
        return url

    # If tunnel not yet active, spawn it quickly
    logger.info("Tunnel URL not found on disk. Spawning quick tunnel now...")
    proc, fresh_url = get_quick_tunnel(timeout_seconds=20)
    if fresh_url:
        return fresh_url
    return ""


def update_vercel_route(new_target_url: str, target_name: str) -> bool:
    """Updates vercel.json rewrites destination and git pushes to GitHub."""
    if not VERCEL_JSON.exists():
        logger.error("vercel.json does not exist!")
        return False

    try:
        with open(VERCEL_JSON, "r", encoding="utf-8") as f:
            content = f.read()

        old_pattern = r'https://[a-zA-Z0-9\.\-]+\.(?:onrender\.com|trycloudflare\.com)'
        new_content = re.sub(old_pattern, new_target_url, content)

        if new_content == content and target_name in content:
            logger.info(f"vercel.json already routed to {new_target_url}")
            return True

        with open(VERCEL_JSON, "w", encoding="utf-8") as f:
            f.write(new_content)

        logger.info(f"Updated vercel.json target -> {new_target_url}")

        # Git commit and push
        subprocess.run(["git", "add", "vercel.json"], cwd=str(BASE_DIR), check=True)
        subprocess.run(
            ["git", "commit", "-m", f"chore(ha-failover): auto-route to {target_name} ({new_target_url})"],
            cwd=str(BASE_DIR),
            check=True
        )
        subprocess.run(["git", "push", "origin", "main"], cwd=str(BASE_DIR), check=True)
        logger.info(f"✅ Successfully pushed route switch to GitHub -> {target_name}")
        return True
    except Exception as e:
        logger.error(f"Failed to update vercel.json and push: {e}")
        return False


async def notify_owner_telegram(message_html: str):
    """Sends notification to owner chat via Telegram Bot API."""
    token = get_telegram_token()
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": OWNER_TELEGRAM_ID,
        "text": message_html,
        "parse_mode": "HTML"
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                logger.info("Telegram notification sent to owner successfully.")
            else:
                logger.warning(f"Telegram API returned code {resp.status_code}: {resp.text}")
    except Exception as e:
        logger.warning(f"Could not send Telegram notification: {e}")


async def check_render_health() -> bool:
    """Checks if Render API is reachable and healthy (returns HTTP 200)."""
    try:
        async with httpx.AsyncClient(timeout=8.0, follow_redirects=True) as client:
            resp = await client.get(RENDER_HEALTH_URL)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("status") in ("healthy", "ok"):
                    return True
            else:
                logger.warning(f"Render returned HTTP {resp.status_code}")
    except Exception as e:
        logger.debug(f"Render health check failed: {e}")
    return False


async def check_local_server_health() -> bool:
    """Checks if local Ghost-QA backend (port 8001) is active."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(LOCAL_HEALTH_URL)
            if resp.status_code == 200:
                return True
    except Exception:
        pass
    return False


async def run_cycle(state: dict, force_direction: str = None) -> dict:
    """Executes a single check and failover/failback evaluation."""
    current_target = get_current_vercel_target()
    state["current_target"] = current_target

    if force_direction == "FAILOVER":
        render_alive = False
        state["render_fail_count"] = 2
    elif force_direction == "FAILBACK":
        render_alive = True
        state["render_success_count"] = 2
    else:
        render_alive = await check_render_health()

    if render_alive:
        state["render_success_count"] += 1
        state["render_fail_count"] = 0
        logger.info(
            f"[HEALTH] Render: UP (streak: {state['render_success_count']}) | Current Vercel target: {current_target}"
        )

        # -------------------------------------------------------------
        # DIRECTION 2 (Failback): Render recovered -> switch back to Render
        # -------------------------------------------------------------
        if (current_target == "TUNNEL" or force_direction == "FAILBACK") and state["render_success_count"] >= 2:
            logger.info("🎉 RENDER HAS RECOVERED! Triggering Auto-Failback to Render...")
            success = update_vercel_route(RENDER_URL, "RENDER")
            if success:
                state["current_target"] = "RENDER"
                state["last_switch_time"] = time.strftime("%Y-%m-%d %H:%M:%S")
                save_state(state)
                msg = (
                    "🎉 <b>Render limiti yangilandi va server to'liq tiklandi!</b>\n\n"
                    "Ghost-QA Sentinel avtomatik ravishda asosiy <b>Render bulut serveriga</b> "
                    f"(<code>{RENDER_URL}</code>) qaytarildi.\n"
                    "✅ Playwright Chaos testlari, REST API va telemetriya to'liq bulutda uzluksiz ishlamoqda!"
                )
                await notify_owner_telegram(msg)
    else:
        state["render_fail_count"] += 1
        state["render_success_count"] = 0
        logger.warning(
            f"[HEALTH] Render: DOWN/SUSPENDED (streak: {state['render_fail_count']}) | Current Vercel target: {current_target}"
        )

        # -------------------------------------------------------------
        # DIRECTION 1 (Failover): Render failed 2x -> switch to Tunnel
        # -------------------------------------------------------------
        if (current_target == "RENDER" or force_direction == "FAILOVER") and state["render_fail_count"] >= 2:
            logger.warning("🚨 RENDER LIMIT EXHAUSTED OR SUSPENDED! Triggering Auto-Failover to Tunnel...")
            tunnel_url = get_active_tunnel_url()
            local_alive = await check_local_server_health()

            if tunnel_url and local_alive:
                success = update_vercel_route(tunnel_url, "TUNNEL")
                if success:
                    state["current_target"] = "TUNNEL"
                    state["last_switch_time"] = time.strftime("%Y-%m-%d %H:%M:%S")
                    state["last_tunnel_url"] = tunnel_url
                    save_state(state)
                    msg = (
                        "🚨 <b>Render limiti tugadi (503 Service Suspended)!</b>\n\n"
                        "Ghost-QA Sentinel uzilishsiz ishlashi uchun Vercel avtomatik ravishda "
                        "<b>Zaxira (Cloudflare Tunnel)</b> serveriga ulandi.\n"
                        f"🌐 Jonli zaxira tunnel manzili: <code>{tunnel_url}</code>\n"
                        f"💻 Lokal port: <code>{LOCAL_PORT}</code>\n"
                        "✅ Playwright, Chaos Monkey, OWASP Radari va Telegram bot 100% uzilishsiz ishlamoqda!"
                    )
                    await notify_owner_telegram(msg)
            else:
                logger.error(
                    f"Cannot complete failover: local_alive={local_alive}, tunnel_url={tunnel_url}"
                )
        elif current_target == "TUNNEL":
            # If already on TUNNEL, ensure vercel.json has latest active tunnel URL
            active_tunnel = get_active_tunnel_url()
            if active_tunnel:
                try:
                    with open(VERCEL_JSON, "r", encoding="utf-8") as f:
                        v_content = f.read()
                    if active_tunnel not in v_content:
                        logger.info(f"Active tunnel URL refreshed -> {active_tunnel}. Updating vercel.json...")
                        update_vercel_route(active_tunnel, "TUNNEL")
                        state["last_tunnel_url"] = active_tunnel
                        save_state(state)
                except Exception as e:
                    logger.warning(f"Could not verify current tunnel in vercel.json: {e}")

    save_state(state)
    return state


async def run_ha_watchdog(single_run: bool = False, force: str = None):
    logger.info("=" * 65)
    logger.info("🔄 GHOST-QA SENTINEL: BI-DIRECTIONAL HA AUTO-FAILOVER WATCHDOG")
    logger.info(f"   Primary Service:  {RENDER_URL}")
    logger.info(f"   Local Port:       {LOCAL_PORT} ({LOCAL_HEALTH_URL})")
    logger.info(f"   Cadence:          Every {CHECK_INTERVAL_SECONDS}s")
    logger.info(f"   Telegram Alerts:  Chat ID {OWNER_TELEGRAM_ID}")
    logger.info("=" * 65)

    state = load_state()

    if single_run or force:
        await run_cycle(state, force_direction=force)
        return

    while True:
        try:
            await run_cycle(state)
        except Exception as e:
            logger.error(f"Unexpected error in HA watchdog: {e}", exc_info=True)

        await asyncio.sleep(CHECK_INTERVAL_SECONDS)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ghost-QA Sentinel HA Failover Watchdog")
    parser.add_argument("--once", action="store_true", help="Run once and exit")
    parser.add_argument("--force-failover", action="store_true", help="Force failover to tunnel now")
    parser.add_argument("--force-failback", action="store_true", help="Force failback to render now")
    args = parser.parse_args()

    force_mode = None
    if args.force_failover:
        force_mode = "FAILOVER"
    elif args.force_failback:
        force_mode = "FAILBACK"

    try:
        asyncio.run(run_ha_watchdog(single_run=args.once, force=force_mode))
    except KeyboardInterrupt:
        logger.info("Watchdog stopped by user.")
