#!/bin/bash
set -e

echo "🗄️  Running database migrations..."
pnpm db:push || echo "⚠️  Migration failed or already up to date, continuing..."

echo "🔍 Checking database status..."
node scripts/init-db.mjs || echo "⚠️  Database check failed, continuing..."

echo "🚀 Starting server..."
pnpm start
