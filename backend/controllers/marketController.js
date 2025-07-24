const getPrice = require('../utils/getCurrentprice');

const getMarketPrice = async(req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    console.log(typeof(symbol))
    try{
        const data = await getPrice(symbol);
        console.log(data);
        res.status(200).json({
            data : data
        })
    }catch(e){
        res.status(404).json(
            {
                success : false,
                error : "could not fetch market data"
            }
        );
    }
};

module.exports = getMarketPrice;