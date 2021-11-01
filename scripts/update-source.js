require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { default: axios } = require('axios');

(async () => {
  const currencies = ['USD', 'EUR','AUD','CAD','AED','TRY','CHF','GBP'];

  const ratesResult = await axios.get('http://data.fixer.io/api/latest', {
    params: {
      access_key: process.env.FIXER_API_KEY,
      symbols: currencies.join(','),
    }
  });
  const rates = ratesResult.data.rates;

  currencies.forEach((baseCurrency) => {
    const conversionCurrencies = currencies.filter(c => c !== baseCurrency);
    const finalRates = conversionCurrencies.reduce((acc, symbol) => {
      acc[symbol] = rates[symbol] / rates[baseCurrency];
      return acc;
    }, {
      [baseCurrency]: 1,
    });
    fs.writeFileSync(path.join(__dirname, `../rates/${baseCurrency}.json`), JSON.stringify(finalRates, null, 2));
  });
})();