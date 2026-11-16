# run_unified_server.py
# Unified High-Availability Server: FastAPI (Port 8001) + Cloudflare Quick Tunnel + Vercel Route Sync
# Modeled after Child Security Bot architecture

import asyncio
import logging
import os
import re
import subprocess
import sys
import time
from pathlib import Path

# Configure UTF-8 stdout on Windows
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | unified_server : %(message)s"
)
logger = logging.getLogger("unified_server")

BASE_DIR = Path(__file__).resolve().parent
LOCAL_PORT = 8001
LOCAL_URL = f"http://127.0.0.1:{LOCAL_PORT}"
CF_BINARY = BASE_DIR / "cloudflared.exe"
TUNNEL_URL_FILE = BASE_DIR / "tunnel_url.txt"
VERCEL_JSON = BASE_DIR / "vercel.json"


def start_cloudflared_tunnel():
    """Start cloudflared in the background and extract the live HTTPS tunnel URL."""
    if not CF_BINARY.exists():
        logger.error(f"cloudflared.exe not found at {CF_BINARY}")
        return None, None

    cmd = [str(CF_BINARY), "tunnel", "--url", LOCAL_URL, "--no-autoupdate"]
    logger.info(f"Starting Cloudflare Tunnel on {LOCAL_URL} ...")
    proc = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )

    tunnel_url = None
    start = time.time()
    while time.time() - start < 30:
        line = proc.stdout.readline()
        if not line:
            time.sleep(0.1)
            continue
        line_clean = line.strip()
        if "trycloudflare.com" in line_clean:
            match = re.search(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com", line_clean)
            if match:
                tunnel_url = match.group(0)
                break

    if not tunnel_url:
        logger.error("Failed to extract tunnel URL within 30 seconds.")
        proc.terminate()
        return None, None

    logger.info(f"✅ Live Cloudflare Tunnel URL: {tunnel_url}")
    try:
        with open(TUNNEL_URL_FILE, "w", encoding="utf-8") as f:
            f.write(tunnel_url)
    except Exception as e:
        logger.warning(f"Could not save tunnel_url.txt: {e}")

    return proc, tunnel_url


def update_vercel_json_and_push(tunnel_url: str):
    """Update vercel.json routes to forward to the active tunnel and git push."""
    if not VERCEL_JSON.exists():
        logger.warning("vercel.json not found, skipping sync.")
        return

    try:
        with open(VERCEL_JSON, "r", encoding="utf-8") as f:
            content = f.read()

        old_pattern = r'https://[a-zA-Z0-9\.\-]+\.(?:onrender\.com|trycloudflare\.com)'
        new_content = re.sub(old_pattern, tunnel_url, content)

        if new_content != content:
            with open(VERCEL_JSON, "w", encoding="utf-8") as f:
                f.write(new_content)
            logger.info("Updated vercel.json with new live tunnel URL.")

            subprocess.run(["git", "add", "vercel.json"], cwd=str(BASE_DIR), check=True)
            subprocess.run(
                ["git", "commit", "-m", f"chore(ha-failover): auto-route to TUNNEL ({tunnel_url})"],
                cwd=str(BASE_DIR),
                check=True
            )
            subprocess.run(["git", "push", "origin", "main"], cwd=str(BASE_DIR), check=True)
            logger.info("✅ Pushed new tunnel route to GitHub for instant Vercel sync!")
        else:
            logger.info("vercel.json is already up to date with active tunnel.")
    except Exception as e:
        logger.warning(f"Could not automatically sync vercel.json: {e}")


async def monitor_tunnel(cf_proc):
    """Keep reading cloudflared logs in background to prevent pipe buffer overflow."""
    while True:
        try:
            line = await asyncio.to_thread(cf_proc.stdout.readline)
            if not line:
                break
        except Exception:
            break


async def main_unified():
    logger.info("=" * 65)
    logger.info("🛡️ GHOST-QA SENTINEL: UNIFIED HIGH-AVAILABILITY SERVER")
    logger.info(f"   Dedicated Port: {LOCAL_PORT}")
    logger.info("=" * 65)

    cf_proc, tunnel_url = start_cloudflared_tunnel()
    if not tunnel_url:
        logger.error("Cannot proceed without an active Cloudflare tunnel.")
        sys.exit(1)

    # Set BACKEND_URL in environment for local process
    os.environ["BACKEND_URL"] = tunnel_url

    # Update vercel.json so Vercel proxies directly to local backup server
    update_vercel_json_and_push(tunnel_url)

    # Start log reader task for cloudflared
    tunnel_task = asyncio.create_task(monitor_tunnel(cf_proc))

    try:
        import uvicorn
        from backend.main import app
        logger.info(f"🚀 Launching FastAPI Core Engine on http://0.0.0.0:{LOCAL_PORT}...")
        config = uvicorn.Config(app, host="0.0.0.0", port=LOCAL_PORT, log_level="info")
        server = uvicorn.Server(config)
        await server.serve()
    except (KeyboardInterrupt, SystemExit):
        logger.info("Shutting down unified server...")
    finally:
        if cf_proc and cf_proc.poll() is None:
            cf_proc.terminate()
        tunnel_task.cancel()
        logger.info("Unified server shutdown complete.")


if __name__ == "__main__":
    try:
        asyncio.run(main_unified())
    except KeyboardInterrupt:
        logger.info("Terminated by user.")
