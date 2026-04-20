const Account = require('../models/Account');

// Hardcoded exchange rates
// I am using these to avoid external API dependencies so my app runs seamlessly offline
const rates = {
  USD: 1,
  SEK: 0.0978,
  EUR: 1.082,
};

// Helper function I wrote to normalize any currency into USD
function toUSD(amount, currency) {
  return +(amount * (rates[currency] || 1)).toFixed(2);
}

// @desc    Get total net worth and breakdowns
// @route   GET /api/stats/networth
exports.getNetWorth = async (req, res) => {
  try {
    // First, I grab all the accounts from the database
    const accounts = await Account.find({});
    
    // Setting up my final response object structure below
    let totalUSD = 0;
    const byCountry = {};
    const byType = {};

    accounts.forEach(acc => {
      // Convert each account balance into my base currency (USD)
      const balanceUSD = toUSD(acc.balance, acc.currency);
      
      // Add to my total sum
      totalUSD += balanceUSD;

      // Group my balances by country
      if (!byCountry[acc.country]) byCountry[acc.country] = 0;
      byCountry[acc.country] += balanceUSD;

      // Group my balances by asset type (savings, investment, cash)
      if (!byType[acc.type]) byType[acc.type] = 0;
      byType[acc.type] += balanceUSD;
    });

    // Formatting all my numerical results so they look like nice 2-decimal floats
    for (let country in byCountry) {
      byCountry[country] = +byCountry[country].toFixed(2);
    }
    for (let type in byType) {
      byType[type] = +byType[type].toFixed(2);
    }

    // Send my aggregated JSON payload to the frontend
    res.json({
      totalUSD: +totalUSD.toFixed(2),
      byCountry,
      byType
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};
