#!/bin/sh
set -e

echo "[entrypoint] running prisma migrate deploy..."
node ./node_modules/prisma/build/index.js migrate deploy || {
  echo "[entrypoint] migrate deploy failed, attempting db push..."
  node ./node_modules/prisma/build/index.js db push --accept-data-loss
}

echo "[entrypoint] seeding admin user..."
node ./node_modules/tsx/dist/cli.mjs ./scripts/seed.ts || echo "[entrypoint] seed warning (non-fatal)"

echo "[entrypoint] starting server..."
exec "$@"
