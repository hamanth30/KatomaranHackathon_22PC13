// routes/face.routes.js
const express = require('express');
const router = express.Router();
const faceController = require('../controllers/face.controller');
const upload = require('../middleware/upload.middleware');

/**
 * @route GET /api/faces
 * @desc Get all registered faces
 */
router.get('/', faceController.getAllFaces);

/**
 * @route POST /api/faces
 * @desc Register a new face
 */
router.post('/', upload.single('image'), faceController.registerFace);

/**
 * @route POST /api/faces/recognize
 * @desc Recognize a face from an image
 */
router.post('/recognize', upload.single('image'), faceController.recognizeFace);

/**
 * @route GET /api/faces/user/:id
 * @desc Get a user by ID
 */
router.get('/user/:id', faceController.getUserById);

module.exports = router;