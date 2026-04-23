const mongoose = require('mongoose');

const snapshotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    balanceUSD: {
      type: Number,
      required: true
    },
    exchangeRate: {
      type: Number,
      required: true
    },
    recordedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports =
  mongoose.models.Snapshot || mongoose.model('Snapshot', snapshotSchema);