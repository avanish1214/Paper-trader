const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema(
    {
        symbol : {
            type : String
        },
        quantity :{
            type : Number
        },
        price : {
            type : Number
        }
    }
);

const portfolioSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId, 
            ref : 'User', 
            required : true
        },
        holdings : [holdingSchema]
    }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);