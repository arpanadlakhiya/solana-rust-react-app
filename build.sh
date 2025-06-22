#!/bin/bash

# Exit on error
set -e

echo "Installing dependencies..."
curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash

echo "Building Solana program..."
cd solana-program
npm install
anchor build

echo "Building backend API..."
cd ../backend-api
npm install
npm run build
