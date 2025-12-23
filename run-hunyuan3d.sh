#!/bin/bash

# Hunyuan3D-2 Docker Runner Script
# This script runs the Hunyuan3D-2 Space locally with GPU support

set -e

echo "🚀 Starting Hunyuan3D-2 Space..."
echo "📍 This will run on http://localhost:7860"
echo ""

# Check if nvidia-docker is available
if ! command -v nvidia-smi &> /dev/null; then
    echo "⚠️  Warning: nvidia-smi not found. GPU support may not be available."
    echo "   Please ensure NVIDIA drivers are installed."
    echo ""
fi

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"
echo "🎬 Launching Hunyuan3D-2..."
echo ""

# Run the container
docker run -it \
  -p 7860:7860 \
  --platform=linux/amd64 \
  --gpus all \
  registry.hf.space/tencent-hunyuan3d-2:latest \
  python gradio_app.py

echo ""
echo "👋 Hunyuan3D-2 has stopped"
