@echo off
REM Hunyuan3D-2 Docker Runner Script for Windows
REM This script runs the Hunyuan3D-2 Space locally with GPU support

echo.
echo Starting Hunyuan3D-2 Space...
echo This will run on http://localhost:7860
echo.

REM Check if docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo Docker is running
echo Launching Hunyuan3D-2...
echo.

REM Run the container
docker run -it -p 7860:7860 --platform=linux/amd64 --gpus all registry.hf.space/tencent-hunyuan3d-2:latest python gradio_app.py

echo.
echo Hunyuan3D-2 has stopped
pause
