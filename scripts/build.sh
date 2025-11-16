#!/bin/bash
set -e

echo "📦 Installing dependencies..."
# Render deploys run pnpm with a frozen lockfile by default, which fails if
# the overrides configuration in package.json changes without regenerating the
# lockfile. We explicitly disable the frozen lockfile here to ensure the build
# succeeds even when overrides were updated intentionally.
pnpm install --no-frozen-lockfile

echo "🌐 Installing Playwright browsers..."
# Render build containers do not allow switching to the root user, which causes
# `playwright install --with-deps` to fail when it attempts to install system
# libraries (su: Authentication failure). We try installing with dependencies
# first and gracefully fall back to the regular install to keep the build
# succeeding while still installing the Chromium browser when possible.
if ! pnpm exec playwright install --with-deps chromium; then
  echo "⚠️  Failed to install Playwright dependencies, retrying without --with-deps"
  pnpm exec playwright install chromium
fi

echo "🏗️  Building application..."
pnpm build

echo "✅ Build completed successfully!"
echo "⚠️  Database migrations will run on server start"
