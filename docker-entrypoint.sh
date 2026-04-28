#!/bin/sh
# Do NOT set -e: we want to continue starting the server even if DB ops fail
# (the app surfaces friendly errors and the operator can intervene).

echo "[entrypoint] running prisma db push (sync schema)..."
node ./node_modules/prisma/build/index.js db push --accept-data-loss --skip-generate || \
  echo "[entrypoint] WARNING: db push failed — server will start anyway, fix DATABASE_URL"

echo "[entrypoint] seeding admin user..."
node ./node_modules/tsx/dist/cli.mjs ./scripts/seed.ts || \
  echo "[entrypoint] WARNING: seed failed (non-fatal)"

echo "[entrypoint] starting server..."
exec "$@"
