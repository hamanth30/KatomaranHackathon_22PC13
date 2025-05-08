import logger from '../utils/logger.js';

/**
 * Global error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
};

export default errorMiddleware;