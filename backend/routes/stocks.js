const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const fs = require("fs");
const path = require("path");


const stocksPath = path.join(__dirname, "./stocks.json"); 
let stockList = [];

try {
  const rawData = fs.readFileSync(stocksPath, "utf-8");
  stockList = JSON.parse(rawData);
} catch (error) {
  console.error("Failed to load stocks.json:", error);
}

router.get("/search", authMiddleware, async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ success: false, message: "Missing query" });
  }

  
  const results = stockList.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
  );

  res.json({ success: true, results });
});

module.exports = router;
