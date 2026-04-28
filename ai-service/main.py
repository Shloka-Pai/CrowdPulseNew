from fastapi import FastAPI, UploadFile, File, Form
import shutil
import os
import requests
from video_processor import process_video
from utils import is_video_file

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Node.js backend URL
BACKEND_WEBHOOK_URL = os.environ.get("BACKEND_WEBHOOK_URL", "http://localhost:5000/api/alerts/ai-webhook")

@app.post("/analyze-video")
async def analyze_video(file: UploadFile = File(...), target_zone: str = Form("North Stage")):

    # 🔥 validate file
    if not is_video_file(file.filename):
        return {
            "status": "error",
            "message": "Invalid video format"
        }

    file_path = f"{UPLOAD_DIR}/{file.filename}"

    # save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 🔥 process video
    result = process_video(file_path, target_zone)
    
    # Always push telemetry to backend so the dashboard stays live
    try:
        requests.post(BACKEND_WEBHOOK_URL, json=result, timeout=5)
    except Exception as e:
        print(f"Failed to push webhook to backend: {e}")

    return {
        "status": "success",
        "analysis": result
    }