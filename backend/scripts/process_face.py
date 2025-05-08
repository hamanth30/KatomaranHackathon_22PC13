# scripts/process_face.py
import cv2
import numpy as np
import os
import sys
import json
import base64

# Face detection model paths
MODEL_FILE = "models/res10_300x300_ssd_iter_140000.caffemodel"
CONFIG_FILE = "models/deploy.prototxt"
CONFIDENCE_THRESHOLD = 0.4
FACE_SIZE = (112, 112)

def ensure_models_exist():
    """Check if model files exist, exit if not"""
    if not os.path.exists(MODEL_FILE) or not os.path.exists(CONFIG_FILE):
        result = {
            "success": False,
            "message": "Face detection model files not found"
        }
        print(json.dumps(result))
        sys.exit(1)

def process_image(image_path):
    """Process the input image and detect faces"""
    # Load face detection model
    face_net = cv2.dnn.readNetFromCaffe(CONFIG_FILE, MODEL_FILE)
    
    # Read image
    frame = cv2.imread(image_path)
    if frame is None:
        return {"success": False, "message": "Failed to read image"}
    
    # Detect face
    blob = cv2.dnn.blobFromImage(frame, 1.0, (300, 300), [104, 117, 123], False, False)
    face_net.setInput(blob)
    detections = face_net.forward()
    
    # Process detections
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > CONFIDENCE_THRESHOLD:
            box = detections[0, 0, i, 3:7] * np.array([frame.shape[1], frame.shape[0], frame.shape[1], frame.shape[0]])
            (x, y, x2, y2) = box.astype("int")
            face = frame[y:y2, x:x2]
            
            if face.size == 0:
                continue
                
            # Convert to grayscale and resize
            face_gray = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
            face_resized = cv2.resize(face_gray, FACE_SIZE)
            
            # Convert image to base64 for JSON transmission
            _, buffer = cv2.imencode('.png', face_resized)
            face_base64 = base64.b64encode(buffer).decode('utf-8')
            
            return {
                "success": True,
                "face_data": face_base64,
                "shape": face_resized.shape
            }
    
    return {"success": False, "message": "No face detected in the image"}

def main():
    if len(sys.argv) < 3:
        result = {
            "success": False,
            "message": "Usage: python process_face.py <image_path> <name>"
        }
        print(json.dumps(result))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    # Make sure model directory exists
    if not os.path.exists("models"):
        os.makedirs("models")
    
    ensure_models_exist()
    result = process_image(image_path)
    print(json.dumps(result))

if __name__ == "__main__":
    main()