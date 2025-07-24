const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        userName : {
            type : String,
            required : true,
            unique : true,
            trim : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            trim : true
        },
        phoneNo : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        cash : {
            type : Number,
            default : 10000
        }
    }, {timestamps: true}
);

module.exports = mongoose.model('User', UserSchema);