# 🛡️ Ghost-QA & Self-Healing Sentinel
> **Autonomous B2B SaaS Platform:** Headless Chaos Crawler, AI Root-Cause Diagnostic Engine, 1-Click Pull Request Generator, and Sentinel Command Center.

![Ghost-QA Banner](https://img.shields.io/badge/Ghost--QA-Autonomous_Sentinel_v2.0-06b6d4?style=for-the-badge&logo=shield)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-Chromium-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram_Bot-aiogram_3.x-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)

---

## 🚀 Overview

**Ghost-QA & Self-Healing Sentinel** is an autonomous quality engineering platform designed for engineering teams. It visits your web applications using headless browsers, launches chaos monkey interactions to trigger uncaught exceptions, network failures, and layout obstructions, pinpoints the root cause down to the exact lines in your codebase using **Google Gemini**, and autonomously generates code patches and GitHub Pull Requests.

---

## ☁️ 1-Click Cloud Deployment (Render & Vercel)

### 1. Backend Core (FastAPI + Playwright Chromium + WebSockets)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/f-1331/Ghost-QA-Sentinel)

Ghost-QA Sentinel includes a production-ready `render.yaml` blueprint and multi-stage `Dockerfile` with Playwright Chromium pre-installed.
- **Platform:** [Render.com](https://dashboard.render.com)
- **Blueprint:** `render.yaml` (auto-configured Docker container)
- **Health Check:** `/api/health`

### 2. Frontend Command Center (Next.js 14)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ff-1331%2FGhost-QA-Sentinel&root-directory=frontend)

- **Platform:** [Vercel](https://vercel.com)
- **Root Directory:** `frontend`
- **Framework:** `Next.js`
- **Env Variable:** `NEXT_PUBLIC_BACKEND_URL` (set to your Render backend URL)

---

## 🏗️ Architecture & Monorepo Structure

```
ghost-qa-sentinel/
├── backend/                  # Core Python FastAPI Orchestrator
│   ├── config.py             # Pydantic v2 settings & environment variables
│   ├── database.py           # SQLAlchemy SQLite engine & session management
│   ├── models.py             # Scans, Incidents, and ScanLogs database schema
│   ├── main.py               # REST API, WebSockets (/ws/scan), and static mounts
│   ├── requirements.txt      # FastAPI, Playwright, google-genai, aiogram, PyGithub
│   ├── screenshots/          # High-resolution error captures
│   └── services/
│       ├── crawler.py        # Playwright async crawler & Chaos Monkey engine
│       ├── ai_healer.py      # Google Gemini 2.5 Flash SDK + Heuristic Self-Healer
│       ├── github_service.py # PyGithub PR dispatcher (with Simulation Mode fallback)
│       └── telegram_bot.py   # aiogram 3.x bot with interactive inline buttons
│
├── frontend/                 # Cyberpunk "Sentinel Theme" Command Center
│   ├── src/
│   │   ├── app/              # Next.js 14 App Router (layout, page, globals.css)
│   │   └── components/
│   │       ├── Navbar.tsx        # System telemetry indicators
│   │       ├── StatsCards.tsx    # Live defect & self-healing metrics
│   │       ├── TerminalLogs.tsx  # Real-time WebSocket terminal stream
│   │       ├── IncidentCard.tsx  # Defect cards, EN/UZ diagnosis, 1-click actions
│   │       └── DiffViewer.tsx    # Monaco-style Side-by-Side & Unified Diff viewer
│   ├── tailwind.config.js    # Sentinel cyberpunk color palette
│   └── package.json
│
├── demo-broken-app/          # Built-in Chaos Sandbox Target ("CyberMart")
│   ├── index.html            # Single-page e-commerce app
│   ├── app.js                # Contains intentional runtime & network bugs
│   └── style.css             # Contains intentional z-index overlay blocker
│
├── .env.example              # Template configuration
└── README.md
```

---

## ⚡ Key Features

1. **Autonomous Playwright Chaos Crawler:**
   - Visits target web applications in headless Chromium.
   - Intercepts uncaught `pageerror` and `console.error` events.
   - Monitors failed network requests (`status >= 400` or fetch aborts).
   - Detects layout obstacles (`z-index` overlays obstructing buttons).
   - Automatically takes full-context viewport screenshots upon failure.

2. **AI Diagnostic & Self-Healing Engine (Google Gemini 2.5 Flash):**
   - Ingests Playwright stack traces, DOM context, and source code.
   - Diagnoses root causes with dual-language technical explanations:
     - 🇬🇧 **English** root cause breakdown.
     - 🇺🇿 **O'zbekcha** texnik tahlil va tavsiyalar.
   - Generates precise unified git diff patches.
   - Features intelligent heuristic fallback for seamless offline local execution.

3. **1-Click Self-Healing & Pull Request Dispatcher:**
   - **Apply Local Patch:** Writes the AI-generated fix directly to the target file on disk (`demo-broken-app/app.js` or `style.css`), allowing immediate re-testing to prove the bug was resolved.
   - **Create GitHub PR:** Automatically creates a feature branch (`fix/ghost-qa-<id>`), commits the fix, and opens a Pull Request on GitHub.

4. **Real-time Cyberpunk Command Center Dashboard:**
   - High-Tech Dark Security "Sentinel Theme" with slate/obsidian backdrop, neon emerald healthy nodes, and crimson alert markers.
   - Real-time WebSocket terminal streaming live crawler actions.
   - Monaco-style side-by-side code diff viewer.
   - Full-resolution screenshot inspector modal.

5. **Telegram Bot Controller (`aiogram 3.x`):**
   - Instant rich incident alerts with defect screenshot, error traceback, and AI root cause.
   - Inline interactive buttons: `[ ✅ Approve & Create PR ]`, `[ 🔍 View in Dashboard ]`, and `[ ❌ Ignore ]`.

---

## 🛠️ Getting Started (Step-by-Step)

### Prerequisites
- **Python 3.11+**
- **Node.js 18+ & npm**

### 1. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optional: Add your `GEMINI_API_KEY`, `GITHUB_TOKEN`, and `TELEGRAM_BOT_TOKEN`. The platform includes high-fidelity simulation fallbacks so it works 100% out-of-the-box offline!)*

### 2. Start the Backend Server
In the root directory, activate your virtual environment:
```bash
# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

# Install dependencies & Playwright browser
pip install -r backend/requirements.txt
playwright install chromium

# Start FastAPI server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API is now live at `http://localhost:8000`.
- API Health: `http://localhost:8000/api/health`
- Built-in Sandbox Target: `http://localhost:8000/sandbox`

### 3. Start the Next.js Command Center
In a new terminal:
```bash
cd frontend
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Demonstrating the Self-Healing Cycle

1. Open `http://localhost:3000`.
2. Notice the target URL is pre-filled with `http://localhost:8000/sandbox`.
3. Click **"Launch Chaos Scan"**.
4. Watch the real-time WebSocket terminal logs stream as the Playwright agent tests each button.
5. Inspect the detected bugs:
   - **Bug #1:** `TypeError: Cannot read properties of undefined (reading 'calculateGrandTotal')` on `#checkout-btn`.
   - **Bug #2:** `HTTP 500: DatabaseConnectionTimeoutException` on `#sync-inventory-btn`.
   - **Bug #3:** `LAYOUT_BLOCK: Obstructed by #ghost-blocker-overlay` on `#claim-voucher-btn`.
   - **Bug #4:** `TypeError: Cannot read properties of null (reading 'rate')` on `#calc-tax-btn`.
6. Inspect the side-by-side diff comparing the buggy code against the AI-generated fix.
7. Click **"Apply Self-Healing Patch Locally"** on any incident.
8. Re-run **"Launch Chaos Scan"** — the patched bug will no longer trigger, proving autonomous self-healing!
9. Click **"Reset Sandbox"** whenever you want to restore the intentional bugs and run again.

---

## 📜 License
MIT License. Built for autonomous systems and reliable web applications.
