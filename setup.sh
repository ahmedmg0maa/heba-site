#!/bin/bash
echo "================================================"
echo "  Heba Brand Platform - Setup Script"
echo "================================================"
echo ""

npm config set strict-ssl false
npm config set legacy-peer-deps true

echo "[1/3] Installing dependencies..."
npm install --legacy-peer-deps --no-audit

echo ""
echo "[2/3] Checking .env.local..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "  Created .env.local — please add your OPENAI_API_KEY"
fi

echo ""
echo "[3/3] Starting dev server..."
echo "  Open: http://localhost:3000"
echo ""
npm run dev
