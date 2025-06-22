#!/bin/bash

# Exit on error
set -e

echo "Building Solana program..."
cd solana-program
npm install
anchor build

echo "Building backend API..."
cd ../backend-api
npm install
npm run build
