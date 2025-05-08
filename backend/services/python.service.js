import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Process face image using Python script
 * @param {string} imagePath - Path to the image file
 * @param {string} name - Name of the person
 * @returns {Promise<object>} Processing result
 */
export async function processFaceImage(imagePath, name) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'scripts', 'process_face.py');
    const pythonProcess = spawn('python', [scriptPath, imagePath, name]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
      logger.error(`Python error: ${data.toString()}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        logger.error(`Python process exited with code ${code}: ${error}`);
        reject(new Error(`Failed to process face: ${error}`));
        return;
      }

      try {
        const processedResult = JSON.parse(result);
        resolve({
          success: true,
          ...processedResult
        });
      } catch (err) {
        logger.error(`Failed to parse Python output: ${err.message}`);
        reject(new Error('Failed to parse processing result'));
      }
    });
  });
}

/**
 * Recognize face using Python script
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<object>} Recognition result
 */
export async function recognizeFace(imagePath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'scripts', 'recognize_face.py');
    logger.info(`Running face recognition with script: ${scriptPath}`);
    logger.info(`Image path: ${imagePath}`);

    const pythonProcess = spawn('python', [scriptPath, imagePath]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
      logger.info(`Python output: ${data.toString()}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
      logger.error(`Python error: ${data.toString()}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        logger.error(`Python process exited with code ${code}: ${error}`);
        reject(new Error(`Failed to recognize face: ${error}`));
        return;
      }

      try {
        const recognitionResult = JSON.parse(result);
        logger.info(`Recognition result: ${JSON.stringify(recognitionResult)}`);
        resolve({
          success: true,
          ...recognitionResult
        });
      } catch (err) {
        logger.error(`Failed to parse Python output: ${err.message}`);
        reject(new Error('Failed to parse recognition result'));
      }
    });
  });
}