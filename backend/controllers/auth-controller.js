
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerUser = async(req, res) => {
    console.log("req is", req.body);
    try {
        const {userName, email, phoneNo, password, cash} = req.body;
        
        //check if the user already exists  
        const checkExistingUser = await User.findOne({$or : [{userName}, {email}, {phoneNo}]});
        if(checkExistingUser){
            return res.status(400).json({
                success : false,
                message : 'User already exists with given username/email/phonenumber'
            });
        }

        console.log(checkExistingUser);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user then and save it in the db

        const newUser = new User ({
            userName,
            email,
            phoneNo,
            password : hashedPassword,
            cash
        });
        const savedUser = await newUser.save();
        console.log(savedUser)
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
        if(newUser){
            
            res.status(201).json({
                success : true,
                message : 'successfully registered user',
                accessToken : token,
            });
            
        }
        else{
            res.status(400).json({
                success : false,
                message : 'Failed to register user'
            });
        }
    } catch(e){
        console.error("Registration Error:", e.message);

        return res.status(400).json({
            success : false,
            message : 'some error occured'
        });
    }
};


const loginUser = async(req, res) =>{
    try{
        const {userName, password} = req.body;
        const user = await User.findOne({userName});
        
        if(!user){
            res.status(401).json({
                success:false,
                message : 'Invalid username'
            });
        }
        else {
            if(await bcrypt.compare(password, user.password)){
                const accessToken = jwt.sign({
                    userId : user._id,
                    username : user.userName,
                    cash : user.cash
                }, process.env.JWT_SECRET_KEY, {
                    expiresIn : '15m'
                })
                res.status(200).json({
                    success:true,
                    message : 'Logged in successfully',
                    accessToken : accessToken
                });
            }
            else{
                res.status(401).json({
                    success : false,
                    message : 'invalid password'
                });
            }
        }
    }
    catch(e){
        return res.status(500).json({
            success : false,
            message : 'Some error occured, try again'
        });
    }
};

module.exports = {registerUser, loginUser};