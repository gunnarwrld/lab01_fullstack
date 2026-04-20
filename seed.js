const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env variables from backend/.env
dotenv.config({ path: './backend/.env' });

const User = require('./backend/models/User');
const Account = require('./backend/models/Account');
const Snapshot = require('./backend/models/Snapshot');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('MongoDB connection open...');

    await User.deleteMany();
    await Account.deleteMany();
    await Snapshot.deleteMany();
    console.log('Cleared existing data.');

    // Create User
    const user = await User.create({
      name: 'Carlos Mendez',
      email: 'carlos.mendez@student.hkr.se',
      baseCurrency: 'USD',
      country: 'Sweden'
    });

    // Create Accounts
    const accountsData = [
      { userId: user._id, name: 'Swedbank savings', type: 'savings', country: 'Sweden', currency: 'SEK', balance: 63440, institution: 'Swedbank' },
      { userId: user._id, name: 'Avanza portfolio', type: 'investment', country: 'Sweden', currency: 'SEK', balance: 98200, institution: 'Avanza' },
      { userId: user._id, name: 'Banco Pichincha', type: 'savings', country: 'Ecuador', currency: 'USD', balance: 4900, institution: 'Banco Pichincha' },
      { userId: user._id, name: 'Produbanco investment', type: 'investment', country: 'Ecuador', currency: 'USD', balance: 5000, institution: 'Produbanco' },
      { userId: user._id, name: 'Cash on hand', type: 'cash', country: 'Sweden', currency: 'SEK', balance: 3200, institution: 'N/A' },
    ];

    const createdAccounts = await Account.insertMany(accountsData);

    // Hardcode SEK to USD rate: 0.0978
    const exchangeRates = { SEK: 0.0978, USD: 1 };
    
    const snapshots = [];
    
    createdAccounts.forEach(account => {
        // Generate random snapshots looking back 6 months
        for(let i = 6; i >= 1; i--) {
            // Fake some historical balance fluctuation
            const historicalBalance = account.balance * (1 - (i * 0.05) + (Math.random() * 0.05));
            const rate = exchangeRates[account.currency];
            const balanceUSD = +(historicalBalance * rate).toFixed(2);
            
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            
            snapshots.push({
                userId: user._id,
                accountId: account._id,
                balanceUSD,
                exchangeRate: rate,
                recordedAt: date
            });
        }
    });

    await Snapshot.insertMany(snapshots);

    console.log('Successfully seeded User, Accounts, and Snapshots!');
    process.exit();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDatabase();
