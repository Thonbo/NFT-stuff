# Hunyuan3D-2 Local Setup Guide

This repository includes setup for running Tencent's Hunyuan3D-2 Space locally using Docker.

## Prerequisites

- **GPU Required**: This Space requires a GPU with NVIDIA drivers
- **nvidia-docker2**: [Installation guide](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)
- **Docker**: Latest version with containerd engine enabled

## Quick Start

### Option 1: Using Docker Directly

Run the Hunyuan3D-2 Space with GPU support:

```bash
docker run -it -p 7860:7860 --platform=linux/amd64 --gpus all \
  registry.hf.space/tencent-hunyuan3d-2:latest python gradio_app.py
```

Then open your browser to: `http://localhost:7860`

### Option 2: Using Docker Compose

We've provided a `docker-compose.yml` for easier management:

```bash
docker-compose up
```

Stop the service:
```bash
docker-compose down
```

## Available Versions

The Space is available in multiple versions:
- `latest` (recommended)
- Specific version tags available on HuggingFace

## Configuration

### Port Mapping
- Default: Port 7860 (host) → 7860 (container)
- Modify in `docker-compose.yml` if needed

### GPU Configuration
- Default: All GPUs accessible
- Modify `--gpus all` to specify specific GPUs (e.g., `--gpus device=0`)

## Cloning the Space Repository

If you want to clone the full Space repository with LFS files:

```bash
# Install git-xet if needed
brew install git-xet
git xet install

# Clone the repository
git clone https://huggingface.co/spaces/tencent/Hunyuan3D-2
```

Or clone without large files:
```bash
GIT_LFS_SKIP_SMUDGE=1 git clone https://huggingface.co/spaces/tencent/Hunyuan3D-2
```

## Docker Engine Requirements

**Important**: You need to enable the new **containerd** engine in Docker for pulling and storing images. This will be the Docker default in the future.

[Read more about Docker containerd engine](https://docs.docker.com/storage/containerd/)

## System Requirements

- **GPU**: NVIDIA GPU with CUDA support
- **RAM**: 16GB+ recommended
- **Disk Space**: 10GB+ for Docker images
- **OS**: Linux (recommended), Windows with WSL2, or macOS with GPU support

## Troubleshooting

### GPU Not Detected
```bash
# Verify nvidia-docker installation
nvidia-smi
docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
```

### Port Already in Use
If port 7860 is occupied, change it:
```bash
docker run -it -p 8080:7860 --platform=linux/amd64 --gpus all \
  registry.hf.space/tencent-hunyuan3d-2:latest python gradio_app.py
```

### Memory Issues
Increase Docker memory limit in Docker Desktop settings or modify Docker daemon configuration.

### Connection Issues
If you can't access the HuggingFace registry:
1. Check your network connection
2. Verify Docker can access external registries
3. Try using a VPN or different network

## Additional Resources

- [HuggingFace Space](https://huggingface.co/spaces/tencent/Hunyuan3D-2)
- [Docker Documentation](https://docker.com)
- [NVIDIA Docker Installation](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)
- [Docker Hub](https://docker.com)

## Support

For issues specific to Hunyuan3D-2, please visit the [HuggingFace Space](https://huggingface.co/spaces/tencent/Hunyuan3D-2) and check the discussion board.
