#!/bin/bash

# Install dependencies
npm install

# Build frontend
npm run build

# Make the script executable
chmod +x vercel-build.sh