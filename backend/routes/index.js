import express from 'express';
import faceRoutes from './face.routes.js';

const router = express.Router();

// Mount face-related routes under /face-auth
router.use('/face-auth', faceRoutes);

export default router;