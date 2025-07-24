const mongoose = require('mongoose');
const Portfolio = require('./models/portfolio');// adjust path as needed
require('dotenv').config();

// Replace with your MongoDB URI
mongoose.connect(process.env.MONGO_URL);

const seedPortfolio = async () => {
  try {
    const userId = '687ba1119a088cc32d6f69a0'; // Replace this with actual User ID

    const newPortfolio = new Portfolio({
      userId,
      holdings: [
        { symbol: 'RELIANCE.NS', quantity: 10, price: 2500 },
        { symbol: 'TCS.NS', quantity: 5, price: 3800 }
      ]
    });

    await newPortfolio.save();
    console.log('✅ Portfolio created successfully');
  } catch (err) {
    console.error('❌ Error creating portfolio:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedPortfolio();
