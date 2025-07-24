const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
        symbol :{
            type : String,
            required : true
        },
        quantity : {
            type : Number,
            required : true
        },
        pricePerstock : {
            type : Number,
            required : true
        },
        totalPrice : {
            type : Number,
            required : true
        },
        order : {
            type : String,
            enum : ['buy', 'sell'],
            required : true
        },
        timestamp : {
            type : Date,
            default : Date.now
        }
    }
);

module.exports = mongoose.model('trades', tradeSchema);     