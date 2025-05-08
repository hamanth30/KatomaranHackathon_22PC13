// controllers/face.controller.js
import fs from 'fs';
import { getDB, COLLECTIONS } from '../config/db.config.js';
import { processFaceImage, recognizeFace as recognizeFaceService } from '../services/python.service.js';
import { Binary, ObjectId } from 'mongodb';
import logger from '../utils/logger.js';

export async function getAllFaces(req, res, next) {
  try {
    const db = getDB();
    const collection = db.collection(COLLECTIONS.FACES);
    
    const faces = await collection.find({}, { 
      projection: { name: 1, created_at: 1 } 
    }).toArray();
    
    res.json(faces);
  } catch (err) {
    logger.error(`Error fetching faces: ${err.message}`);
    next(err);
  }
}

export async function registerFace(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    
    const name = req.body.name;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    logger.info(`Processing face image for registration: ${req.file.path}`);
    const imagePath = req.file.path;
    const result = await processFaceImage(imagePath, name);

    if (!result.success) {
      logger.error(`Face processing failed: ${result.message || 'Unknown error'}`);
      return res.status(400).json({ error: result.message || 'Failed to process face' });
    }
    
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
    logger.error(`Error registering face: ${err.stack}`);
    next(err);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) logger.error(`Error deleting file: ${err.message}`);
      });
    }
  }
}

export async function recognizeFace(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    logger.info(`Processing face image for recognition: ${req.file.path}`);
    const imagePath = req.file.path;
    
    try {
      const result = await recognizeFaceService(imagePath);
      logger.info(`Recognition result: ${JSON.stringify(result)}`);
      
      if (result.success && result.matched) {
        res.json({
          status: 'recognized',
          userId: result.userId,
          message: 'Face recognized successfully'
        });
      } else if (result.success && !result.matched) {
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
    } catch (recognitionError) {
      logger.error(`Face recognition error: ${recognitionError.stack}`);
      throw recognitionError;
    }
  } catch (err) {
    logger.error(`Error in face recognition endpoint: ${err.stack}`);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: `Failed to recognize face: ${err.message}` 
    });
  } finally {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) logger.error(`Error deleting file: ${err.message}`);
      });
    }
  }
}

export async function getUserById(req, res, next) {
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