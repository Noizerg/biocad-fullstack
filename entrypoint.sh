#!/bin/sh

echo "🧪 Running e2e tests..."
pnpm exec jest apps/api/src/auth/auth.e2e-spec.ts --config=apps/api/jest-e2e.json

echo "🚀 Starting NestJS server..."
pnpm exec nest start --watch