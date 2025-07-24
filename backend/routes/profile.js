const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const User = require('../models/user');

router.get('/profile', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.userInfo.userId).select('-password');
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching profile'
      });
    }
  });

module.exports = router;