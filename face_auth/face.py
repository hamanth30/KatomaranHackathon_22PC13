import cv2
import numpy as np
import os
from pymongo import MongoClient
from bson.binary import Binary
from datetime import datetime

# MongoDB Atlas configuration
MONGO_URI = "mongodb+srv://hamanth:hamanth123@cluster0.wyhmy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "faceDB"
COLLECTION_NAME = "faces"

# Face detection model paths
MODEL_FILE = "models/res10_300x300_ssd_iter_140000.caffemodel"
CONFIG_FILE = "models/deploy.prototxt"
CONFIDENCE_THRESHOLD = 0.4
RECOGNITION_THRESHOLD = 65
FACE_SIZE = (112, 112)

def init_db():
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        print("[INFO] Connected to MongoDB Atlas.")
        return collection
    except Exception as e:
        print(f"[ERROR] MongoDB connection failed: {e}")
        return None

def save_face(collection, name, face_image):
    if collection is None:
        print("[WARNING] Cannot save face in offline mode")
        return
    try:
        face_doc = {
            "name": name,
            "image": Binary(face_image.tobytes()),
            "shape": str(face_image.shape),
            "created_at": datetime.utcnow()
        }
        collection.insert_one(face_doc)
        print(f"[INFO] Face saved to MongoDB as '{name}'.")
    except Exception as e:
        print(f"[ERROR] Failed to save face: {e}")

def load_faces(collection):
    if collection is None:
        print("[INFO] No database connection - starting with empty face collection")
        return [], [], {}
    try:
        cursor = collection.find()
        images, labels = [], []
        label_map = {}
        current_label = 0

        for doc in cursor:
            name = doc['name']
            if name not in label_map:
                label_map[name] = current_label
                current_label += 1

            shape = tuple(map(int, doc['shape'].strip('()').split(',')))
            img_array = np.frombuffer(doc['image'], dtype=np.uint8)
            img = img_array.reshape(shape)
            images.append(img)
            labels.append(label_map[name])

        id_name_map = {v: k for k, v in label_map.items()}
        return images, labels, id_name_map
    except Exception as e:
        print(f"[ERROR] Failed to load faces: {e}")
        return [], [], {}

def init_face_detector():
    if not os.path.exists(MODEL_FILE) or not os.path.exists(CONFIG_FILE):
        print("[ERROR] Face detection model files not found.")
        return None
    return cv2.dnn.readNetFromCaffe(CONFIG_FILE, MODEL_FILE)

def get_available_camera_index(max_index=5):
    for i in range(max_index):
        cap = cv2.VideoCapture(i)
        if cap is not None and cap.isOpened():
            ret, _ = cap.read()
            cap.release()
            if ret:
                print(f"[INFO] Using camera index: {i}")
                return i
    raise RuntimeError("[ERROR] No working camera found.")

def start_camera():
    collection = init_db()
    print("[INFO] Loading faces from database...")
    images, labels, id_name_map = load_faces(collection)
    face_net = init_face_detector()
    if not face_net:
        return

    recognizer = cv2.face.LBPHFaceRecognizer_create()
    if images:
        recognizer.train(images, np.array(labels))

    cam_index = get_available_camera_index()
    cap = cv2.VideoCapture(cam_index)

    while True:
        print("[INFO] Previewing camera feed. Press 'c' to capture.")
        while True:
            ret, frame = cap.read()
            if not ret:
                print("[ERROR] Frame grab failed. Retrying...")
                cap.release()
                cam_index = get_available_camera_index()
                cap = cv2.VideoCapture(cam_index)
                continue
            cv2.imshow("Camera Preview", frame)
            if cv2.waitKey(1) & 0xFF == ord('c'):
                break
        cv2.destroyWindow("Camera Preview")

        # Detect face
        ret, frame = cap.read()
        if not ret:
            continue
        blob = cv2.dnn.blobFromImage(frame, 1.0, (300, 300), [104, 117, 123], False, False)
        face_net.setInput(blob)
        detections = face_net.forward()

        face_found = False
        for i in range(detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence > CONFIDENCE_THRESHOLD:
                box = detections[0, 0, i, 3:7] * np.array([frame.shape[1], frame.shape[0], frame.shape[1], frame.shape[0]])
                (x, y, x2, y2) = box.astype("int")
                face = frame[y:y2, x:x2]
                if face.size == 0:
                    continue
                face_gray = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
                face_resized = cv2.resize(face_gray, FACE_SIZE)

                text = "Unknown"
                if images:
                    label, confidence = recognizer.predict(face_resized)
                    name = id_name_map.get(label, "Unknown")
                    if confidence < RECOGNITION_THRESHOLD:
                        text = f"{name} ({int(confidence)})"
                        print(f"[INFO] Face recognized as {name}. Exiting.")
                        cv2.rectangle(frame, (x, y), (x2, y2), (0, 255, 0), 2)
                        cv2.putText(frame, text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
                        cv2.imshow("Face Recognition", frame)
                        cv2.waitKey(2000)
                        cap.release()
                        cv2.destroyAllWindows()
                        return

                # Save unknown face
                cv2.imshow("Unknown Face", face_resized)
                print("[INFO] Unknown face detected.")
                name = input("Enter name for this face (or leave blank to skip): ").strip()
                cv2.destroyWindow("Unknown Face")
                if name:
                    save_face(collection, name, face_resized)
                    images.append(face_resized)
                    new_label = max(id_name_map.keys(), default=-1) + 1
                    labels.append(new_label)
                    id_name_map[new_label] = name
                    recognizer.train(images, np.array(labels))
                    print(f"[INFO] Recognizer retrained with new face '{name}'.")
                face_found = True
                break

        if not face_found:
            print("[INFO] No face detected. Retrying...")

if __name__ == "__main__":
    start_camera()
