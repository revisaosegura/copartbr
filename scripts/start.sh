#!/bin/bash
set -e

# Playwright desabilitado por padrão (USE_PLAYWRIGHT=false)
# Descomente as linhas abaixo se quiser habilitar Playwright
# echo "🎭 Installing Playwright browsers..."
# pnpm exec playwright install chromium --with-deps || echo "⚠️  Playwright install failed, continuing..."

echo "🗄️  Running database migrations..."
pnpm db:push || echo "⚠️  Migration failed or already up to date, continuing..."

echo "🚀 Starting server..."
pnpm start
