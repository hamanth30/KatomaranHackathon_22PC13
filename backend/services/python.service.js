// services/python.service.js
const { spawn } = require('child_process');
const logger = require('../utils/logger');

/**
 * Execute a Python script and return the result
 * @param {string} scriptPath - Path to the Python script
 * @param {Array} args - Arguments to pass to the script
 * @returns {Promise<object>} - JSON result from the Python script
 */
async function executePythonScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [scriptPath, ...args]);
    
    let result = '';
    let errorOutput = '';
    
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        logger.error(`Python process exited with code ${code}: ${errorOutput}`);
        return reject(new Error(`Python script failed with code ${code}: ${errorOutput}`));
      }
      
      try {
        const resultObj = JSON.parse(result);
        return resolve(resultObj);
      } catch (err) {
        logger.error(`Error parsing Python result: ${err.message}`);
        return reject(new Error(`Failed to parse Python output: ${err.message}`));
      }
    });
  });
}

/**
 * Process a face image
 * @param {string} imagePath - Path to the image file
 * @param {string} name - Name to associate with the face
 * @returns {Promise<object>} - Processed face data
 */
async function processFaceImage(imagePath, name) {
  try {
    return await executePythonScript('scripts/process_face.py', [imagePath, name]);
  } catch (error) {
    logger.error(`Error processing face image: ${error.message}`);
    throw error;
  }
}

/**
 * Recognize a face from an image
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<object>} - Recognition result
 */
async function recognizeFace(imagePath) {
  try {
    return await executePythonScript('scripts/recognize_face.py', [imagePath]);
  } catch (error) {
    logger.error(`Error recognizing face: ${error.message}`);
    throw error;
  }
}

module.exports = {
  processFaceImage,
  recognizeFace
};