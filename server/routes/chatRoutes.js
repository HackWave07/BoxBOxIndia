const express = require('express');
const router = express.Router();
const { chat, clearHistory } = require('../controllers/chatController');

// POST /api/chat - Send a message to the AI assistant
router.post('/', chat);

// POST /api/chat/clear - Clear conversation history (optional)
router.post('/clear', clearHistory);

module.exports = router;
