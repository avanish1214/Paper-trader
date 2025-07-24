const User = require('../models/user');


const AddMoney = async(req, res) =>{
    const amount = req.body.amount;
    try{
        const userId = req.userInfo.userId;
        

        if(!amount || amount<0){
            return res.status(404).json({
                success : false,
                message : 'invalid please enter some money to be added'
            });
        }
        const user = await User.findByIdAndUpdate(userId,
            { $inc: { cash: amount } },
            {new : true}
        );

        return res.status(200).json({
            success : true,
            message : 'money credited'
        });
    }catch(e){
        return res.status(404).json({
            success : false,
            message : 'money could not be credited'
        });
    }
}

module.exports = AddMoney;