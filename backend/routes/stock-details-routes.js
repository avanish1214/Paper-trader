const express = require('express');

const router = express.Router();
const getStockDetails = require('../controllers/stock-controller');

const authMiddleware = require('../middleware/auth-middleware');

router.get("/details/:symbol", authMiddleware, getStockDetails)
module.exports = router