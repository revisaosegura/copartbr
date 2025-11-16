#!/bin/bash
set -e

# Instala os navegadores do Playwright por padrão, a menos que USE_PLAYWRIGHT=false
if [ "${USE_PLAYWRIGHT:-true}" != "false" ]; then
  echo "🎭 Ensuring Playwright browsers are installed..."

  PLAYWRIGHT_INSTALLED=false

  # Render (and other managed hosts) do not allow sudo/su, so attempting to
  # install system dependencies would fail. Only try the `--with-deps` flag
  # when running as root.
  if [ "$(id -u)" -eq 0 ]; then
    if pnpm exec playwright install chromium --with-deps; then
      PLAYWRIGHT_INSTALLED=true
    else
      echo "⚠️  Playwright install with --with-deps failed, retrying without extra dependencies..."
    fi
  fi

  if [ "$PLAYWRIGHT_INSTALLED" = false ]; then
    pnpm exec playwright install chromium || echo "⚠️  Playwright install failed, continuing..."
  fi
else
  echo "🎭 Skipping Playwright installation (USE_PLAYWRIGHT=false)"
fi

echo "🗄️  Running database migrations..."
pnpm db:push || echo "⚠️  Migration failed or already up to date, continuing..."

echo "🚀 Starting server..."
pnpm start
