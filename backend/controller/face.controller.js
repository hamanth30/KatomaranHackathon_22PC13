// controllers/face.controller.js
const fs = require('fs');
const { getDB, COLLECTIONS } = require('../config/db.config');
const { processFaceImage, recognizeFace } = require('../services/python.service');
const { Binary, ObjectId } = require('mongodb');
const logger = require('../utils/logger');

/**
 * Get all registered faces
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function getAllFaces(req, res, next) {
  try {
    const db = getDB();
    const collection = db.collection(COLLECTIONS.FACES);
    
    // Only return name and ID, not the image data to keep response size small
    const faces = await collection.find({}, { 
      projection: { name: 1, created_at: 1 } 
    }).toArray();
    
    res.json(faces);
  } catch (err) {
    logger.error(`Error fetching faces: ${err.message}`);
    next(err);
  }
}

/**
 * Register a new face
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function registerFace(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    
    const name = req.body.name;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Process the uploaded image
    const imagePath = req.file.path;
    const result = await processFaceImage(imagePath, name);

    if (!result.success) {
      return res.status(400).json({ error: result.message || 'Failed to process face' });
    }
    
    // Save to MongoDB
    const db = getDB();
    const collection = db.collection(COLLECTIONS.FACES);
    const faceBuffer = Buffer.from(result.face_data, 'base64');
    
    const insertResult = await collection.insertOne({
      name: name,
      image: Binary(faceBuffer),
      shape: result.shape,
      created_at: new Date()
    });
    
    res.status(201).json({ 
      status: 'registered',
      message: 'Face registered successfully',
      name: name,
      userId: insertResult.insertedId
    });
  } catch (err) {
    logger.error(`Error registering face: ${err.message}`);
    next(err);
  } finally {
    // Clean up the uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) logger.error(`Error deleting file: ${err.message}`);
      });
    }
  }
}

/**
 * Recognize a face from an uploaded image
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function recognizeFace(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imagePath = req.file.path;
    const result = await recognizeFace(imagePath);
    
    if (result.success && result.matched) {
      // Face is recognized
      res.json({
        status: 'recognized',
        userId: result.userId,
        message: 'Face recognized successfully'
      });
    } else if (result.success && !result.matched) {
      // New face detected
      res.json({
        status: 'new_face',
        message: 'New face detected'
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: result.message || 'Failed to process face'
      });
    }
  } catch (err) {
    logger.error(`Error recognizing face: ${err.message}`);
    next(err);
  } finally {
    // Clean up the uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) logger.error(`Error deleting file: ${err.message}`);
      });
    }
  }
}

/**
 * Get a user by ID
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function getUserById(req, res, next) {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const db = getDB();
    const collection = db.collection(COLLECTIONS.FACES);
    
    const user = await collection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { name: 1, created_at: 1 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    logger.error(`Error fetching user: ${err.message}`);
    next(err);
  }
}

module.exports = {
  getAllFaces,
  registerFace,
  recognizeFace,
  getUserById
};