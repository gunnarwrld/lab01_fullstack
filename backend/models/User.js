const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    baseCurrency: { type: String, required: true, default: 'USD', uppercase: true },
    country: { type: String, required: true, trim: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);