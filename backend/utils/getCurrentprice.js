const yahooFinance = require('yahoo-finance2').default;

const getPrice = async (symbol) => {
    try {
        if (!symbol || typeof symbol !== 'string' || symbol.trim() === '') {
            throw new Error('Invalid symbol');
        }

        const quote = await yahooFinance.quote(symbol);
        return {
            symbol: quote.symbol,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            percentChange: quote.regularMarketChangePercent,
            currency: quote.currency
        };
    } catch (e) {
        console.error(`Error fetching price for symbol "${symbol}":`, e.message);
        throw new Error('Failed to fetch price');
    }
};

module.exports = getPrice;
