const express = require('express');
const getPortfolio = require('../controllers/portfolio-controller');
router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');

router.get('/portfolio', authMiddleware, getPortfolio);

module.exports = router;