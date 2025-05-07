// routes/index.js
const express = require('express');
const faceRoutes = require('./face.routes');

const router = express.Router();

// Register face-related routes
router.use('/faces', faceRoutes);

module.exports = router;