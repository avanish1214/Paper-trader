const mongoose = require('mongoose');

const connectDb = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to db successfully");
    }
    catch(e){
        console.error("MonggoDB connection Failed");
        process.exit(1);
    }
};

module.exports = connectDb;