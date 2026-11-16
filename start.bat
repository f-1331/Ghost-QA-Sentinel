@echo off
chcp 65001 >nul
title 🛡️ GHOST-QA SENTINEL v3.0 - 1-CLICK LAUNCHER
cls
echo =====================================================================
echo    🛡️ GHOST-QA SENTINEL - AUTONOMOUS AI QUALITY ASSURANCE SUITE
echo =====================================================================
echo.
echo [1/3] Starting FastAPI Core Engine (Port 8000)...
start "Ghost-QA Backend (Port 8000)" cmd /c "cd /d "%~dp0" && set PYTHONPATH=%~dp0 && .\venv\Scripts\python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000"

echo [2/3] Starting Next.js Cyberpunk Dashboard (Port 3000)...
start "Ghost-QA Frontend (Port 3000)" cmd /c "cd /d "%~dp0\frontend" && npm run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 4 /nobreak >nul

echo.
echo ✅ ALL SYSTEMS OPERATIONAL!
echo    - Dashboard: http://localhost:3000
echo    - Backend:   http://localhost:8000/api/health
echo    - Sandbox:   http://localhost:8000/sandbox
echo.
echo Opening browser...
start http://localhost:3000

echo.
echo You can leave this window or close it. The servers are running in their own windows.
pause
