const getMarketPrice = require('../controllers/marketController');
const express = require('express');

const router = express.Router();

router.get('/:symbol', getMarketPrice);

module.exports = router;