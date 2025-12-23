# Hunyuan3D-2 Local Setup

Run Tencent's state-of-the-art 3D generation model locally with GPU support.

## What is Hunyuan3D-2?

Hunyuan3D-2 is Tencent's advanced AI model for generating 3D models from text descriptions or images. This repository provides everything you need to run it locally on your machine with GPU acceleration.

## Quick Start

### Prerequisites

- Docker installed
- NVIDIA GPU with CUDA support
- nvidia-docker2 installed

### Run the Model

**Option 1: Using the run script (easiest)**
```bash
./run-hunyuan3d.sh
```

**Option 2: Using Docker Compose**
```bash
docker-compose up
```

**Option 3: Direct Docker command**
```bash
docker run -it -p 7860:7860 --platform=linux/amd64 --gpus all \
  registry.hf.space/tencent-hunyuan3d-2:latest python gradio_app.py
```

Then open your browser to: **http://localhost:7860**

## Documentation

- **[Quick Start Guide](QUICK_START_3D.md)** - Get up and running in minutes
- **[Full Setup Guide](HUNYUAN3D_SETUP.md)** - Detailed installation and configuration

## Features

- Generate 3D models from text prompts
- Create 3D models from images
- GPU-accelerated processing
- Web-based Gradio interface
- Docker containerized for easy deployment

## System Requirements

- **GPU**: NVIDIA GPU with CUDA support (required)
- **RAM**: 16GB+ recommended
- **Disk Space**: 10GB+ for Docker images
- **OS**: Linux (recommended), Windows with WSL2, or macOS

## Installation

### 1. Install Docker

**Ubuntu/Debian:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

**macOS/Windows:**
Download [Docker Desktop](https://www.docker.com/products/docker-desktop)

### 2. Install NVIDIA Docker Support

```bash
# Add NVIDIA Container Toolkit repository
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
  sudo tee /etc/apt/sources.list.d/nvidia-docker.list

# Install nvidia-docker2
sudo apt-get update
sudo apt-get install -y nvidia-docker2

# Restart Docker
sudo systemctl restart docker
```

### 3. Verify GPU Access

```bash
nvidia-smi
docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
```

## Usage

1. Start the container using one of the methods above
2. Wait for the model to load (first run will download ~5-10GB)
3. Open http://localhost:7860 in your browser
4. Enter a text prompt or upload an image
5. Generate your 3D model!

## Stopping the Service

**If using run script or direct Docker:**
- Press `Ctrl+C` in the terminal

**If using Docker Compose:**
```bash
docker-compose down
```

## Troubleshooting

### GPU Not Detected
```bash
# Check NVIDIA drivers
nvidia-smi

# Test Docker GPU access
docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
```

### Port Already in Use
Change the port in `docker-compose.yml` or use a different port:
```bash
docker run -it -p 8080:7860 --platform=linux/amd64 --gpus all \
  registry.hf.space/tencent-hunyuan3d-2:latest python gradio_app.py
```

### Out of Memory
Reduce batch size or image resolution in the Gradio interface.

### Cannot Pull Docker Image
- Check your internet connection
- Verify you can access HuggingFace registry
- Try using a VPN if blocked

## Advanced Configuration

### Custom Port
Edit `docker-compose.yml` and change the port mapping:
```yaml
ports:
  - "8080:7860"  # Change 8080 to your desired port
```

### Specific GPU Selection
Specify which GPU to use:
```bash
docker run -it -p 7860:7860 --platform=linux/amd64 --gpus device=0 \
  registry.hf.space/tencent-hunyuan3d-2:latest python gradio_app.py
```

### Memory Limits
Add memory limits to docker-compose.yml:
```yaml
deploy:
  resources:
    limits:
      memory: 16G
```

## Files in This Repository

- `run-hunyuan3d.sh` - Quick start script for running the model
- `docker-compose.yml` - Docker Compose configuration
- `QUICK_START_3D.md` - Quick start guide
- `HUNYUAN3D_SETUP.md` - Detailed setup documentation
- `.dockerignore` - Docker ignore rules

## Resources

- [Official HuggingFace Space](https://huggingface.co/spaces/tencent/Hunyuan3D-2)
- [NVIDIA Docker Installation](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)
- [Docker Documentation](https://docs.docker.com/)
- [Gradio Documentation](https://gradio.app/)

## Support

For issues specific to Hunyuan3D-2, visit:
- [HuggingFace Space Discussions](https://huggingface.co/spaces/tencent/Hunyuan3D-2/discussions)

For Docker or GPU issues, see the [troubleshooting guide](HUNYUAN3D_SETUP.md#troubleshooting).

## License

This repository provides setup scripts for running Hunyuan3D-2. Please refer to the [official HuggingFace Space](https://huggingface.co/spaces/tencent/Hunyuan3D-2) for model license information.
