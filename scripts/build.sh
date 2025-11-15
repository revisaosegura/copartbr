#!/bin/bash
set -e

echo "📦 Installing dependencies..."
# Render deploys run pnpm with a frozen lockfile by default, which fails if
# the overrides configuration in package.json changes without regenerating the
# lockfile. We explicitly disable the frozen lockfile here to ensure the build
# succeeds even when overrides were updated intentionally.
pnpm install --no-frozen-lockfile

echo "🏗️  Building application..."
pnpm build

echo "✅ Build completed successfully!"
echo "⚠️  Database migrations will run on server start"
