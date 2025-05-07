# main.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson.binary import Binary
from datetime import datetime
import numpy as np
import cv2

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URI = "mongodb+srv://<your-username>:<your-password>@cluster0.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI)
db = client["faceDB"]
collection = db["faces"]

# Load model
net = cv2.dnn.readNetFromCaffe("models/deploy.prototxt", "models/res10_300x300_ssd_iter_140000.caffemodel")

FACE_SIZE = (112, 112)

def detect_face(img):
    h, w = img.shape[:2]
    blob = cv2.dnn.blobFromImage(img, 1.0, (300, 300), (104, 177, 123))
    net.setInput(blob)
    detections = net.forward()
    for i in range(detections.shape[2]):
        conf = detections[0, 0, i, 2]
        if conf > 0.4:
            box = detections[0, 0, i, 3:7] * [w, h, w, h]
            x1, y1, x2, y2 = box.astype("int")
            face = img[y1:y2, x1:x2]
            return cv2.resize(face, FACE_SIZE)
    return None

@app.post("/recognize")
async def recognize(image: UploadFile = File(...)):
    contents = await image.read()
    img = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_COLOR)

    face = detect_face(img)
    if face is None:
        return {"status": "no_face"}

    for record in collection.find():
        known = cv2.imdecode(np.frombuffer(record["image"], np.uint8), cv2.IMREAD_COLOR)
        score = np.mean(cv2.absdiff(face, known))
        if score < 65:
            return {"status": "known", "name": record["name"]}
    return {"status": "unknown"}

@app.post("/register")
async def register(name: str = Form(...), image: UploadFile = File(...)):
    contents = await image.read()
    img = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_COLOR)

    face = detect_face(img)
    if face is None:
        return {"status": "error", "message": "No face detected"}

    _, buffer = cv2.imencode(".jpg", face)
    collection.insert_one({
        "name": name,
        "image": Binary(buffer.tobytes()),
        "registered_at": datetime.now()
    })

    return {"status": "registered", "name": name}
