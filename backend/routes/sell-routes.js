const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const sellStock = require('../controllers/sell-controller');
const router = express.Router();

router.post('/sell', authMiddleware, sellStock);

module.exports = router;