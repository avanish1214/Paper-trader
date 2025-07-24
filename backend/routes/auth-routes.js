const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/auth-controller');
const authMiddleware = require("../middleware/auth-middleware");

router.post('/register', registerUser);
router.post('/login', loginUser);


router.get("/verify", authMiddleware, (req, res) => {
  res.status(200).json({ valid: true });
});

module.exports = router;


module.exports = router;
