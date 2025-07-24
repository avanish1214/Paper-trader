// /api/prices endpoint
const express = require('express');
const router = express.Router();
const getCurrentPrice = require('../utils/getCurrentprice');

router.get('/api/prices', async (req, res) => {
    try {
      let symbols = req.query.symbols.split(',');
      const prices = {};

      
      for (const symbol of symbols) {
        // Fetch current price from your data source
        symbol = symbol.includes('.NS') ? symbol : symbol + '.NS';
        const price = await getCurrentPrice(symbol);
        prices[symbol] = price;
      }
      
      res.json({ success: true, prices });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch prices' });
    }
  });
  