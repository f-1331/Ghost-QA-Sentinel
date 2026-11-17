# tunnel_runner.py
# High-Availability Cloudflare Quick Tunnel Manager for Ghost-QA Sentinel

import logging
import os
import re
import subprocess
import sys
import threading
import time
from pathlib import Path

# Configure UTF-8 stdout on Windows
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | tunnel_runner : %(message)s"
)
logger = logging.getLogger("tunnel_runner")

BASE_DIR = Path(__file__).resolve().parent
CLOUDFLARED_BIN = BASE_DIR / "cloudflared.exe"
TUNNEL_URL_FILE = BASE_DIR / "tunnel_url.txt"
LOCAL_PORT = 8001
LOCAL_URL = f"http://127.0.0.1:{LOCAL_PORT}"


def get_quick_tunnel(timeout_seconds: int = 35):
    """
    Spawns cloudflared quick tunnel pointing to Ghost-QA Sentinel (port 8001)
    and captures the assigned trycloudflare.com URL.
    """
    if not CLOUDFLARED_BIN.exists():
        logger.error(f"cloudflared.exe not found at {CLOUDFLARED_BIN}!")
        return None, None

    cmd = [
        str(CLOUDFLARED_BIN),
        "tunnel",
        "--url",
        LOCAL_URL,
        "--no-autoupdate"
    ]
    logger.info(f"Spawning Cloudflare Quick Tunnel for {LOCAL_URL}...")

    proc = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )

    tunnel_url = None
    start = time.time()
    while time.time() - start < timeout_seconds:
        line = proc.stdout.readline()
        if not line:
            time.sleep(0.1)
            continue
        line_str = line.strip()
        if "trycloudflare.com" in line_str:
            match = re.search(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com", line_str)
            if match:
                tunnel_url = match.group(0)
                break

    if not tunnel_url:
        logger.error(f"Failed to obtain trycloudflare.com URL within {timeout_seconds}s")
        proc.terminate()
        return None, None

    logger.info(f"🚀 CLOUDFLARE TUNNEL ONLINE: {tunnel_url}")
    try:
        with open(TUNNEL_URL_FILE, "w", encoding="utf-8") as f:
            f.write(tunnel_url.strip())
        logger.info(f"Saved tunnel URL to {TUNNEL_URL_FILE.name}")
    except Exception as e:
        logger.warning(f"Could not write tunnel_url.txt: {e}")

    return proc, tunnel_url


def get_saved_tunnel_url() -> str:
    """Reads previously saved tunnel URL from file if valid."""
    if TUNNEL_URL_FILE.exists():
        try:
            with open(TUNNEL_URL_FILE, "r", encoding="utf-8") as f:
                url = f.read().strip()
                if url.startswith("https://") and "trycloudflare.com" in url:
                    return url
        except Exception:
            pass
    return ""


def drain_pipe(proc):
    """Continuously drain stdout in background thread to prevent pipe buffer overflow."""
    try:
        while proc.poll() is None:
            line = proc.stdout.readline()
            if not line:
                break
    except Exception:
        pass


def run_persistent_tunnel():
    """Runs Cloudflare tunnel persistently, restarting on unexpected exits."""
    logger.info("=" * 65)
    logger.info("🌐 GHOST-QA SENTINEL: CLOUDFLARE TUNNEL PERSISTENT RUNNER")
    logger.info(f"   Local Service Port: {LOCAL_PORT}")
    logger.info(f"   Target URL:         {LOCAL_URL}")
    logger.info("=" * 65)

    while True:
        proc, url = get_quick_tunnel()
        if not proc or not url:
            logger.warning("Tunnel start failed, retrying in 5 seconds...")
            time.sleep(5)
            continue

        print(f"\n[ACTIVE_TUNNEL] {url}\n", flush=True)

        # Auto-update vercel.json if Render is down
        try:
            from render_failback_watchdog import update_vercel_route
            update_vercel_route(url, "TUNNEL")
        except Exception as e:
            logger.warning(f"Could not auto-sync vercel.json: {e}")

        # Start pipe drain thread
        drain_thread = threading.Thread(target=drain_pipe, args=(proc,), daemon=True)
        drain_thread.start()

        try:
            proc.wait()
            logger.warning("Tunnel process exited. Restarting in 3 seconds...")
            time.sleep(3)
        except KeyboardInterrupt:
            logger.info("Stopping Cloudflare tunnel...")
            proc.terminate()
            try:
                proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                proc.kill()
            if TUNNEL_URL_FILE.exists():
                try:
                    TUNNEL_URL_FILE.unlink()
                except Exception:
                    pass
            logger.info("Tunnel stopped cleanly.")
            break


if __name__ == "__main__":
    run_persistent_tunnel()
