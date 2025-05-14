#!/bin/bash

# Set memory limits
export NODE_OPTIONS="--max-old-space-size=2048"

# Clean up any previous build artifacts
echo "Cleaning previous build artifacts..."
rm -rf .next || true
rm -rf node_modules/.cache || true

# Install dependencies with legacy peer deps
echo "Installing dependencies..."
npm install --no-audit --no-fund --legacy-peer-deps

# Build the application with reduced concurrency
echo "Building the application..."
npm run build

# Success message
echo "Build completed successfully!" 