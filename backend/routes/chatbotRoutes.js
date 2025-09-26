import express from 'express';
import { handleChatbotQuery, handleChat } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/', handleChatbotQuery);
router.post('/chat', handleChat);

export default router;