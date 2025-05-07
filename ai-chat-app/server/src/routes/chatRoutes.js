import express from 'express';
import { sendMessage, receiveMessages } from '../controllers/chatController.js';

const router = express.Router();

router.post('/send', sendMessage);
router.get('/messages', receiveMessages);

export default router;