const { Server } = require("socket.io");
const getCurrentprice = require("../utils/getCurrentprice");

const homepageSymbols = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS", "BHARTIARTL.NS"];

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "https://frontend-papertrader.onrender.com",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // -------- Homepage stream --------
    const homepageInterval = setInterval(async () => {
      try {
        const stockData = await Promise.all(
          homepageSymbols.map(symbol => getCurrentprice(symbol))
        );
        socket.emit("stock-update", stockData);
      } catch (error) {
        console.error("Homepage data error:", error.message);
      }
    }, 2000);

    // -------- Individual stock card stream --------
    const stockIntervals = {};

    socket.on("subscribe-symbol", async (symbol) => {
      console.log(`Subscribed to symbol: ${symbol}`);

      if (stockIntervals[symbol]) {
        console.log(`Already subscribed to ${symbol}`);
        return;
      }

      // Send initial price immediately
      try {
        const priceData = await getCurrentprice(symbol);
        socket.emit("symbol-price", {
          symbol: symbol,
          price: priceData.regularMarketPrice || priceData.price || priceData,
          fullData: priceData
        });
      } catch (err) {
        console.error(`Error fetching initial price for ${symbol}:`, err.message);
      }

      stockIntervals[symbol] = setInterval(async () => {
        try {
          const priceData = await getCurrentprice(symbol);
          socket.emit("symbol-price", {
            symbol: symbol,
            price: priceData.regularMarketPrice || priceData.price || priceData,
            fullData: priceData
          });
        } catch (err) {
          console.error(`Error fetching price for ${symbol}:`, err.message);
        }
      }, 2000);
    });

    // Handle unsubscribe
    socket.on("unsubscribe-symbol", (symbol) => {
      console.log(`Unsubscribed from symbol: ${symbol}`);
      if (stockIntervals[symbol]) {
        clearInterval(stockIntervals[symbol]);
        delete stockIntervals[symbol];
      }
    });

    // Cleanup on disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      clearInterval(homepageInterval);
      Object.values(stockIntervals).forEach(clearInterval);
      // Clear the intervals object
      Object.keys(stockIntervals).forEach(symbol => {
        delete stockIntervals[symbol];
      });
    });
  });

  return io;
}

module.exports = setupSocket;