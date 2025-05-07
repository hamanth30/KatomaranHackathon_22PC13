// config/db.config.js
const { MongoClient } = require('mongodb');
const logger = require('../utils/logger');

// Database configuration
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://hamanth:hamanth123@cluster0.wyhmy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = process.env.DB_NAME || "faceDB";

// Database connection
let db = null;

/**
 * Connect to MongoDB
 * @returns {Promise<object>} MongoDB database instance
 */
async function connectDB() {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    db = client.db(DB_NAME);
    logger.info('Connected to MongoDB Atlas');
    return db;
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    throw err;
  }
}

/**
 * Get database instance
 * @returns {object} MongoDB database instance
 */
function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
}

module.exports = {
  connectDB,
  getDB,
  DB_NAME,
  COLLECTIONS: {
    FACES: 'faces'
  }
};