const express = require('express');

const router = express.Router();
const AddMoney = require('../controllers/add-money-controller');
const authMiddleware = require('../middleware/auth-middleware');


router.post('/add-money', authMiddleware, AddMoney);

module.exports = router;

