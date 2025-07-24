const mongoose = require('mongoose');

const Portfolio = require('../models/portfolio');
const User = require('../models/user');
const trades = require('../models/trades');
const getPrice = require('../utils/getCurrentprice');

const sellStock = async(req, res) => {
    let {symbol, quantity} = req.body;
    try{
        currSymbol = symbol +'.NS';
        const SellpriceData = await getPrice(currSymbol);
        const Sellprice = SellpriceData.price;
        userId = req.userInfo.userId;
        const user = await User.findById(req.userInfo.userId);
        const portfolio = await Portfolio.findOne({userId});

        if(!portfolio){
            return res.status(404).json({
                success : false,
                message : 'no stocks owned, portfolio not found'
            });
        }
        else{
            const existing = portfolio.holdings.find( h => h.symbol === symbol);

            if(!existing || existing.quantity < quantity){
                return res.status(404).json({
                    success : false,
                    message : 'no stocks owned, or insufficient quantity'
                });
            }
            else{
                const totalquantity = existing.quantity - quantity;
                existing.quantity = totalquantity;
                const amountEarned = quantity * Sellprice;
                user.cash = Number(user.cash) + Number(amountEarned);
                if(existing.quantity == 0){
                    const index = portfolio.holdings.findIndex(h => h.symbol===symbol);
                    if(index !=-1){
                        portfolio.holdings.splice(index,1);
                    }
                }
                await user.save();
                await portfolio.save();
                await trades.create ({
                    userId : userId,
                    symbol : symbol,
                    quantity,
                    pricePerstock : Sellprice,
                    totalPrice : amountEarned,
                    order : 'sell'
                });
                return res.status(200).json({
                    success : true,
                    message :'sold stock successfully',    
                });
            }
        }      
    }catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : 'internal server error (sell)'
        });
    }
};

module.exports = sellStock;