const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// GET tin nhắn giữa 2 user
router.get('/:userID', messageController.getMessagesBetweenUsers);

// POST gửi tin nhắn
router.post('/', messageController.sendMessage);

// GET tin nhắn cuối cùng mỗi user
router.get('/', messageController.getLastMessages);

module.exports = router;