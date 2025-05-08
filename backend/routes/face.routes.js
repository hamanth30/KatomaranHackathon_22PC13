// routes/face.routes.js
import express from 'express';
import multer from 'multer';
import { getAllFaces, registerFace, recognizeFace, getUserById } from '../controller/face.controller.js';

const router = express.Router();

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage: storage });

/**
 * @route GET /api/faces
 * @desc Get all registered faces
 */
router.get('/', getAllFaces);

/**
 * @route POST /api/faces
 * @desc Register a new face
 */
router.post('/register', upload.single('image'), registerFace);

/**
 * @route POST /api/faces/recognize
 * @desc Recognize a face from an image
 */
router.post('/', upload.single('image'), recognizeFace);

/**
 * @route GET /api/faces/user/:id
 * @desc Get a user by ID
 */
router.get('/user/:id', getUserById);

export default router;