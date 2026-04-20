const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true },
  type:        { type: String, enum: ['savings', 'investment', 'cash'], required: true },
  country:     { type: String, required: true },
  currency:    { type: String, required: true }, 
  balance:     { type: Number, required: true, min: 0 },
  institution: { type: String, required: true }, 
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Account', accountSchema);
