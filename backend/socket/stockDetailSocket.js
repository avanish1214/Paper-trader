const { Server } = require("socket.io");
const getCurrentprice = require("../utils/getCurrentprice");

function setupStockDetailSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "https://frontend-papertrader.onrender.com", // frontend port
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Stock detail socket connected:", socket.id);

    let interval;

    socket.on("start-symbol-stream", async (symbol) => {
      console.log("Symbol received for detail stream:", symbol);

      if (!symbol || typeof symbol !== "string") return;

      // Push immediately
      try {
        const price = await getCurrentprice(symbol);
        socket.emit("stock-price-update", price);
      } catch (err) {
        console.error("Initial price fetch error:", err.message);
      }

      // Then set interval
      interval = setInterval(async () => {
        try {
          const price = await getCurrentprice(symbol);
          socket.emit("stock-price-update", price);
        } catch (err) {
          console.error("Interval fetch error:", err.message);
        }
      }, 2000);
    });

    socket.on("disconnect", () => {
      console.log("Stock detail socket disconnected:", socket.id);
      if (interval) clearInterval(interval);
    });
  });
}

module.exports = setupStockDetailSocket;
