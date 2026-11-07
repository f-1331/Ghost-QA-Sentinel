#!/usr/bin/env bash
# Build script for Render.com native Python environment
set -e

echo "==> Upgrading pip..."
pip install --upgrade pip

echo "==> Installing Python dependencies..."
pip install -r backend/requirements.txt

echo "==> Installing Playwright Chromium browser & OS dependencies..."
playwright install --with-deps chromium

echo "==> Build finished successfully!"
