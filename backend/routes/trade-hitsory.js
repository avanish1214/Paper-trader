const express = require('express');
const trades = require('../models/trades');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const getHistory = require('../controllers/history-controller');

router.get('/history', authMiddleware, getHistory);

module.exports = router;




