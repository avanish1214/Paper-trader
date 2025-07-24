const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/auth-middleware');

const User = require('../models/user');


router.get('/welcome', authMiddleware, async (req, res) => {
    const {username, userId} = req.userInfo;
    const user = await User.findById(userId);
    res.json({
        message : 'Welcome to the home page',
        user : {
            _id : userId,
            name : username,
            cash : user.cash
        }
    });
});

module.exports = router;