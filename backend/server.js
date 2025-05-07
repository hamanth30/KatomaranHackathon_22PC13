// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { connectDB } = require('./config/db.config');
const routes = require('./routes');
const errorMiddleware = require('./middleware/error.middleware');
const logger = require('./utils/logger');

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
app.use(cors());
app.use(express.json());

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