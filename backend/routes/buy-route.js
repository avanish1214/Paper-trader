const express = require('express');
const buyStock = require('../controllers/buy-controller');
const authMiddleware = require('../middleware/auth-middleware');

router = express.Router();

router.post('/buy', authMiddleware, buyStock);

module.exports = router;