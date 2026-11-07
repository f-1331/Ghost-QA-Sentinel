# Dockerfile for Ghost-QA Sentinel Core Engine (FastAPI + Playwright Chromium)
FROM mcr.microsoft.com/playwright/python:v1.49.0-jammy

WORKDIR /app

# Ensure non-buffered stdout for real-time streaming logs
ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PORT=8000

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Ensure Playwright Chromium headless browser is installed
RUN playwright install chromium

# Copy application source code
COPY backend/ ./backend/
COPY demo-broken-app/ ./demo-broken-app/

# Expose default port
EXPOSE 8000

# Start FastAPI via Uvicorn dynamically binding to $PORT (Render/Railway/Cloud)
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
