@echo off
title Ghost-QA Sentinel - Unified Server & Render Watchdog
cd /d "%~dp0"

echo ===================================================================
echo   GHOST-QA SENTINEL: UNIFIED HIGH-AVAILABILITY CLUSTER (HA)
echo ===================================================================
echo.
echo [1/4] Starting FastAPI Core Engine on Dedicated Port 8001...
start "Ghost-QA Backend (8001)" cmd /k "set PYTHONPATH=%~dp0 && set DISABLE_SQLALCHEMY_CEXT=1 && .\venv\Scripts\python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8001"

echo [2/4] Starting Next.js Production Dashboard (Port 3000)...
start "Ghost-QA Dashboard (3000)" cmd /k "cd frontend && npm run start"

echo [3/4] Spawning Persistent Cloudflare Tunnel Runner...
start "Ghost-QA Cloudflare Tunnel" cmd /k ".\venv\Scripts\python.exe tunnel_runner.py"

echo [4/4] Starting Render Bi-directional Watchdog in Background...
start "Render Auto-Watchdog" /min .\venv\Scripts\python.exe render_failback_watchdog.py

echo.
echo All High-Availability services successfully launched!
echo Waiting 4 seconds before opening local browser...
timeout /t 4 /nobreak >nul
start http://localhost:3000

echo ===================================================================
echo Services are running. Keep the spawned windows open for 24/7 uptime.
echo ===================================================================
pause
