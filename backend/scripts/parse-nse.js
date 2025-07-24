const fs = require('fs');
const csv = require('csv-parser');

const results = [];

fs.createReadStream("/Users/avanish/Downloads/EQUITY_L.csv")
  .pipe(csv()) // no separator needed if it's comma-separated
  .on('data', (data) => {
    results.push({
      symbol: data['SYMBOL'],
      name: data['NAME OF COMPANY'],
      isin: data['ISIN NUMBER'],
    });
  })
  .on('end', () => {
    console.log(`Parsed ${results.length} stocks`);
    fs.writeFileSync('stocks.json', JSON.stringify(results, null, 2));
  });



  