const Account = require('../models/Account');

// @desc    Get all accounts (supports ?country= and ?type= filters)
// @route   GET /api/accounts
exports.getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.country) filter.country = req.query.country;
    if (req.query.type) filter.type = req.query.type;
    
    // For lab, simple fetch is enough.
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

    // Input validation 
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

// @desc    Update account
// @route   PUT /api/accounts/:id
exports.updateAccount = async (req, res) => {
  try {
    // I need to find the specific account by ID and update it with my incoming body data
    // { new: true } ensures I get the updated document back, not the old one
    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updatedAccount) {
      return res.status(404).json({ error: 'Not found', message: 'Account not found' });
    }
    
    res.json(updatedAccount);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
exports.deleteAccount = async (req, res) => {
  try {
    // I am using findByIdAndDelete to remove the account from my database completely
    const deletedAccount = await Account.findByIdAndDelete(req.params.id);
    
    if (!deletedAccount) {
      return res.status(404).json({ error: 'Not found', message: 'Account not found' });
    }
    
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};
