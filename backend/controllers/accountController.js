const Account = require('../models/Account');

// @desc    Get all accounts (supports ?country= and ?type= filters)
// @route   GET /api/accounts
exports.getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.country) filter.country = req.query.country;
    if (req.query.type) filter.type = req.query.type;
    
    // In a real app we'd get userId from auth middleware. For lab, simple fetch is enough.
    const accounts = await Account.find(filter).populate('userId', 'name baseCurrency');
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

// @desc    Create new account
// @route   POST /api/accounts
exports.create = async (req, res) => {
  try {
    const { userId, name, type, country, currency, balance, institution } = req.body;

    // Input validation required by lab
    if (!userId || !name || !type || !country || !currency || balance === undefined || !institution) {
      return res.status(400).json({ error: 'Bad request', message: 'All fields are required' });
    }

    if (!['savings', 'investment', 'cash'].includes(type)) {
      return res.status(400).json({ error: 'Bad request', message: 'Type must be savings, investment, or cash' });
    }

    const newAccount = await Account.create({
      userId,
      name,
      type,
      country,
      currency,
      balance: Number(balance),
      institution
    });

    res.status(201).json(newAccount);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};
