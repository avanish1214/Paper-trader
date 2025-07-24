const express = require('express');

const trades = require('../models/trades');

const getHistory = async (req, res) => {
    try {
        const userId = req.userInfo.userId;
        const userTrades = await trades.find({userId}).sort({timestamp : -1});
        res.status(200).json(userTrades);
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'unable to fetch trades'
        });
    }
};

module.exports = getHistory