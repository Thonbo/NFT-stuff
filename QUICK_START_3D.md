# Quick Start: Hunyuan3D-2

Get up and running with Hunyuan3D-2 in minutes!

## 🎯 What is Hunyuan3D-2?

Hunyuan3D-2 is Tencent's state-of-the-art 3D generation model that can create 3D models from text descriptions or images. This setup allows you to run it locally on your machine with GPU acceleration.

## ⚡ Fastest Method

### 1. Prerequisites Check

```bash
# Check if you have GPU
nvidia-smi

# Check if Docker is installed
docker --version
```

### 2. Run It!

**Method A: Using the provided script**
```bash
./run-hunyuan3d.sh
```

**Method B: Using Docker Compose**
```bash
docker-compose up
```

**Method C: Direct Docker command**
```bash
docker run -it -p 7860:7860 --platform=linux/amd64 --gpus all \
  registry.hf.space/tencent-hunyuan3d-2:latest python gradio_app.py
```

### 3. Open Your Browser

Navigate to: **http://localhost:7860**

That's it! You're ready to generate 3D models! 🎉

## 🔧 Installation Requirements

If you don't have the prerequisites installed:

### Install Docker
- **Ubuntu/Debian**:
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  ```
- **macOS**: Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Windows**: Download [Docker Desktop](https://www.docker.com/products/docker-desktop) with WSL2

### Install NVIDIA Docker Support

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

## 📝 Usage Tips

1. **First run** will download the Docker image (~5-10GB) - be patient!
2. **GPU is required** for optimal performance
3. **Port 7860** must be available
4. Press **Ctrl+C** to stop the container

## 🐛 Common Issues

### "Cannot connect to Docker daemon"
→ Start Docker: `sudo systemctl start docker`

### "Port 7860 already in use"
→ Change port: Edit `docker-compose.yml` or use different port in run command

### "NVIDIA-SMI not found"
→ Install NVIDIA drivers: `sudo ubuntu-drivers autoinstall`

### "Permission denied"
→ Add user to docker group: `sudo usermod -aG docker $USER`

## 📚 More Information

See [HUNYUAN3D_SETUP.md](HUNYUAN3D_SETUP.md) for detailed documentation.

## 🌐 External Resources

- [Official HuggingFace Space](https://huggingface.co/spaces/tencent/Hunyuan3D-2)
- [NVIDIA Docker Installation Guide](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)
- [Docker Documentation](https://docs.docker.com/)
