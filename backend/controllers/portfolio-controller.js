const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Portfolio = require('../models/portfolio');

const getPortfolio = async(req, res) => {
    //const userId = req.params.userId;
    const userId = req.userInfo.userId;
    console.log(userId);
    try{    
        const portfolio = await Portfolio.findOne({userId});
        if(!portfolio){
            return res.status(404).json({
                success : false,
                message : 'Portfolio not Found'
            });
        }
        else{
            res.status(200).json({
                success : true,
                portfolio : portfolio
            });
        }              
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : 'could not get the portfolio, server error'
        });
    }
};

module.exports = getPortfolio;