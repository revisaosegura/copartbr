#!/bin/bash
set -e

echo "📦 Installing dependencies..."
# Render deploys run pnpm with a frozen lockfile by default, which fails if
# the overrides configuration in package.json changes without regenerating the
# lockfile. We explicitly disable the frozen lockfile here to ensure the build
# succeeds even when overrides were updated intentionally.
pnpm install --no-frozen-lockfile

# Playwright desabilitado por padrão (USE_PLAYWRIGHT=false no render.yaml)
# Descomente as linhas abaixo se quiser habilitar Playwright
# echo "🌐 Installing Playwright browsers..."
# if ! pnpm exec playwright install --with-deps chromium; then
#   echo "⚠️  Failed to install Playwright dependencies, retrying without --with-deps"
#   pnpm exec playwright install chromium
# fi

echo "🏗️  Building application..."
pnpm build

echo "✅ Build completed successfully!"
echo "⚠️  Database migrations will run on server start"
