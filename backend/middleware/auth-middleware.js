const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    if(!token){
        return res.status(403).json({
            success : false,
            message : 'Access Denied. Please login first'
        });
    }
    try {

        console.log(token);
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decodedTokenInfo.userId);
        //console.log(decodedTokenInfo);
        req.userInfo = {
            userId : decodedTokenInfo.userId,
            username : decodedTokenInfo.username,
            cash : user.cash
        };
        return next();
    }
    catch(e){
        return res.status(403).json({
            success : false,
            message : 'Access denied no token provided. Please login'
        });
    }
    
};

module.exports = authMiddleware;