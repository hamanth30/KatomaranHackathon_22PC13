// utils/logger.js

/**
 * Simple logging utility
 */
const logger = {
    /**
     * Log info message
     * @param {string} message - Message to log
     */
    info: (message) => {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
    },
    
    /**
     * Log error message
     * @param {string} message - Error message to log
     */
    error: (message) => {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    },
    
    /**
     * Log warning message
     * @param {string} message - Warning message to log
     */
    warn: (message) => {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
    },
    
    /**
     * Log debug message
     * @param {string} message - Debug message to log
     */
    debug: (message) => {
      if (process.env.DEBUG === 'true') {
        console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`);
      }
    }
  };
  
  module.exports = logger;