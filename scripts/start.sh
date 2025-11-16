#!/bin/bash
set -e

# Instala os navegadores do Playwright por padrão, a menos que USE_PLAYWRIGHT=false
if [ "${USE_PLAYWRIGHT:-true}" != "false" ]; then
  echo "🎭 Ensuring Playwright browsers are installed..."
  pnpm exec playwright install chromium --with-deps || echo "⚠️  Playwright install failed, continuing..."
else
  echo "🎭 Skipping Playwright installation (USE_PLAYWRIGHT=false)"
fi

echo "🗄️  Running database migrations..."
pnpm db:push || echo "⚠️  Migration failed or already up to date, continuing..."

echo "🚀 Starting server..."
pnpm start
