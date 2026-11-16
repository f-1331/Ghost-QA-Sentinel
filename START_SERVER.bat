@echo off
title Ghost-QA Sentinel - Unified Server & Render Watchdog
cd /d "%~dp0"
echo ===================================================================
echo   GHOST-QA SENTINEL: UNIFIED HIGH-AVAILABILITY CLUSTER
echo ===================================================================
echo [1/3] Starting Render Bi-directional Watchdog in Background...
start "Render Auto-Watchdog" /min .\venv\Scripts\python.exe render_failback_watchdog.py

echo [2/3] Starting Next.js Production Dashboard (Port 3000)...
start "Ghost-QA Dashboard" /min cmd /c "cd frontend && npm run start"

echo [3/3] Launching Unified Backend Server (FastAPI + Cloudflare Tunnel)...
.\venv\Scripts\python.exe run_unified_server.py
pause
