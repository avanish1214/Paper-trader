const express = require('express');
const User = require('../models/user');
const Portfolio = require('../models/portfolio');
const trades = require('../models/trades');
const getPrice = require('../utils/getCurrentprice');

const buyStock = async (req, res) => {
    let {symbol, quantity} = req.body;
    const userId = req.userInfo.userId;


    if(!symbol || !quantity) {
        return res.status(400).json({
            success : false,
            message : 'symbol, quantity not provided'
        });
    }
    try{
        let currSymbol = symbol + '.NS';
        const {price} = await getPrice(currSymbol);
        if(!price || isNaN(price)){
            return res.status(400).json({
                success : false,
                message : 'Unable to fetch current price'
            });
        }
        const user = await User.findById(userId);
        let portfolio = await Portfolio.findOne({userId});
        if(!portfolio){
            portfolio = new Portfolio ({
                userId,
                holdings : []
            });
        }
        const totalprice = price * quantity;
        if(user.cash < totalprice){
            return res.status(400).json({
                success : false,
                message : 'not enough funds in account'
            });
        }

        const existing = portfolio.holdings.find(h=> h.symbol === symbol);
        if(existing){
            const totalquantity = existing.quantity + quantity;
            const totalcost =  (existing.price *existing.quantity) + price* quantity;
            existing.quantity = totalquantity;
            existing.price = totalcost / totalquantity;
        } else{
            portfolio.holdings.push({
                symbol,
                quantity, 
                price
            });
        }
        user.cash -= totalprice;
        await portfolio.save();
        await user.save();
        req.userInfo.cash = user.cash;
        await trades.create ({
            userId : userId,
            symbol : symbol,
            quantity,
            pricePerstock : totalprice / quantity,
            totalPrice : totalprice,
            order : 'buy'
        });

        return res.status(200).json({
            success : true,
            message : 'Stock bought successfully'
        });
    }
    catch(e){
        console.log("Buy error", e);
        return res.status(500).json({
            success : false,
            message : 'Server error. Buy again'
        });
    }
};

module.exports = buyStock;