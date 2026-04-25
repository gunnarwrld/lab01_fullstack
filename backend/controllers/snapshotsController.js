const Snapshot = require('../models/Snapshot');

// @desc    Get snapshots for an account
// @route   GET /api/snapshots?accountId=xxx
exports.getByAccount = async (req, res) => {
  try {
    const { accountId } = req.query;
    if (!accountId) {
      return res.status(400).json({ error: 'Bad request', message: 'accountId query param is required' });
    }
    const snapshots = await Snapshot.find({ accountId }).sort({ recordedAt: -1 });
    res.json(snapshots);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

// @desc    Create a snapshot
// @route   POST /api/snapshots
exports.create = async (req, res) => {
  try {
    const { userId, accountId, balanceUSD, exchangeRate } = req.body;
    
    if (!userId || !accountId || balanceUSD === undefined || exchangeRate === undefined) {
      return res.status(400).json({ error: 'Bad request', message: 'Missing required fields' });
    }

    const newSnapshot = await Snapshot.create({
      userId,
      accountId,
      balanceUSD: Number(balanceUSD),
      exchangeRate: Number(exchangeRate)
    });

    res.status(201).json(newSnapshot);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};
