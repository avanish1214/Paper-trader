require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const http = require("http");
const connectDb = require('./database/db');

const authRoutes = require('./routes/auth-routes');
const homeRoutes = require('./routes/home-routes');
const marketRoutes = require('./routes/markets');
const portfolioRoutes = require('./routes/portfolio-routes');
const buyStock = require('./routes/buy-route');
const sellStock = require('./routes/sell-routes');
const getHistory = require('./routes/trade-hitsory');
const addMoney = require('./routes/add-money-routes');
const stockDetails = require('./routes/stock-details-routes');
const Profile = require('./routes/profile');

const setupSocket = require('./socket'); 

const app = express();
const server = http.createServer(app); 

setupSocket(server); 


app.use(cors({
  origin: "https://frontend-papertrader.onrender.com",
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/', portfolioRoutes);
app.use('/api/', buyStock);
app.use('/api/', sellStock);
app.use('/api/', getHistory);
app.use('/api/', addMoney);
app.use("/api/stocks", require("./routes/stocks"));
app.use("/api/stocks-details", stockDetails);
app.use("/api", Profile);

// Connect to DB and start server
connectDb();

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server running at port", port);
});
