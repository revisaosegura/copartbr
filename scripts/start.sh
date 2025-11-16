#!/bin/bash
set -e

# Instala os navegadores do Playwright por padrão, a menos que USE_PLAYWRIGHT=false
if [ "${USE_PLAYWRIGHT:-true}" != "false" ]; then
  echo "🎭 Ensuring Playwright browsers are installed..."

  # Installing with `--with-deps` tries to elevate privileges via `su`, which
  # fails on Render and similar platforms. A plain browser install is enough
  # for our use case, so skip any privileged dependency installs.
  pnpm exec playwright install chromium || echo "⚠️  Playwright install failed, continuing..."
else
  echo "🎭 Skipping Playwright installation (USE_PLAYWRIGHT=false)"
fi

echo "🗄️  Running database migrations..."
pnpm run db:push || echo "⚠️  Migration failed or already up to date, continuing..."

echo "🚀 Starting server..."
pnpm start
