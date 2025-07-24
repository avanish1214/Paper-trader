const yf = require("yahoo-finance2").default;

const getStockDetails = async (req, res) => {
  const symbol = req.params.symbol;

  try {
    // For Indian stocks, add `.BO` (BSE) or `.NS` (NSE)
    const finalSymbol = symbol.includes(".") ? symbol : symbol + ".NS"; 

    const quote = await yf.quote(finalSymbol);
    const summary = await yf.quoteSummary(finalSymbol, { modules: ["assetProfile"] });

    res.json({
      success: true,
      data: {
        price: quote,
        profile: summary.assetProfile,
      },
    });
  } catch (err) {
    console.error("Yahoo Finance error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch stock details" });
  }
};

module.exports = getStockDetails;