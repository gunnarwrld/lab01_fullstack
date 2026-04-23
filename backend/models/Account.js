const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['savings', 'investment', 'cash'],
      required: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    currency: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    balance: {
      type: Number,
      required: true,
      min: 0
    },
    institution: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.models.Account || mongoose.model('Account', accountSchema);