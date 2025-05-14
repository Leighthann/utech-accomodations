#!/bin/bash

# Verify Node.js version
node_version=$(node -v)
echo "Using Node.js version: $node_version"

# Set memory limits but allow more for Node 18
export NODE_OPTIONS="--max-old-space-size=3072"

# Clean up any previous build artifacts
echo "Cleaning previous build artifacts..."
rm -rf .next || true
rm -rf out || true
rm -rf node_modules/.cache || true

# Install dependencies with legacy peer deps
echo "Installing dependencies..."
npm install --no-audit --no-fund --legacy-peer-deps

# Build the application with reduced concurrency
echo "Building the application..."
npm run build

# Check if out directory exists
if [ ! -d "out" ]; then
  echo "ERROR: 'out' directory was not created by the build process!"
  exit 1
else
  echo "Build completed successfully! Static files are in the 'out' directory."
fi 