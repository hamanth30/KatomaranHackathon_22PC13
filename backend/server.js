// server.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { connectDB } from './config/db.config.js';
import routes from './routes/index.js';
import errorMiddleware from './middlewares/error.middleware.js';
import logger from './utils/logger.js';

dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create necessary directories if they don't exist
const dirs = ['uploads', 'scripts', 'models'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    logger.info(`Created directory: ${dir}`);
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5174', // Updated Vite's port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api', routes);

// Error handling middleware
app.use(errorMiddleware);

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();