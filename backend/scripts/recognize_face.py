# scripts/recognize_face.py
import cv2
import numpy as np
import sys
import json
import os
from pymongo import MongoClient
from bson.binary import Binary
from pathlib import Path

# Get the absolute path to the models directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODELS_DIR = os.path.join(BASE_DIR, "models")

# MongoDB Atlas configuration
MONGO_URI = "mongodb+srv://hamanth:hamanth123@cluster0.wyhmy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "faceDB"
COLLECTION_NAME = "faces"

# Face detection model paths
MODEL_FILE = os.path.join(MODELS_DIR, "res10_300x300_ssd_iter_140000.caffemodel")
CONFIG_FILE = os.path.join(MODELS_DIR, "deploy.prototxt")
CONFIDENCE_THRESHOLD = 0.9

def detect_face(image_path):
    """Detect face in the given image using OpenCV DNN"""
    # Check if models exist
    if not os.path.exists(MODEL_FILE) or not os.path.exists(CONFIG_FILE):
        return {"success": False, "error": "Face detection model files not found"}
    
    # Read image
    frame = cv2.imread(image_path)
    if frame is None:
        return {"success": False, "error": "Failed to read image"}
    
    # Load model
    net = cv2.dnn.readNetFromCaffe(CONFIG_FILE, MODEL_FILE)
    
    # Prepare image
    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
        (300, 300), (104.0, 177.0, 123.0))
    
    # Detect faces
    net.setInput(blob)
    detections = net.forward()
    
    # Process detections
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        
        if confidence > CONFIDENCE_THRESHOLD:
            return {
                "success": True,
                "status": "new_face",
                "message": "New face detected",
                "confidence": float(confidence)
            }
    
    return {"success": False, "message": "No face detected in the image"}

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "Usage: python recognize_face.py <image_path>"
        }))
        sys.exit(1)
    
    image_path = sys.argv[1]
    result = detect_face(image_path)
    print(json.dumps(result))

if __name__ == "__main__":
    main()