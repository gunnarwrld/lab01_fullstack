const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const User = require('./models/User');
const Account = require('./models/Account');
const Snapshot = require('./models/Snapshot');

const seedDatabase = async () => {
  try {
    const envUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    const mongoUri =
      envUri && !envUri.includes('<')
        ? envUri
        : 'mongodb://127.0.0.1:27017/financetracker';

    console.log(
      'Connecting to MongoDB at:',
      mongoUri.startsWith('mongodb://127.0.0.1')
        ? 'local instance (127.0.0.1:27017)'
        : 'Atlas Cloud'
    );

    await mongoose.connect(mongoUri);
    await mongoose.connection.asPromise();

    console.log('MongoDB connected');
    console.log('Ready state:', mongoose.connection.readyState);
    console.log('User connection === mongoose.connection:', User.db === mongoose.connection);
    console.log('Account connection === mongoose.connection:', Account.db === mongoose.connection);
    console.log('Snapshot connection === mongoose.connection:', Snapshot.db === mongoose.connection);

    await Snapshot.deleteMany({});
    await Account.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data.');

    const user = await User.create({
      name: 'Carlos Mendez',
      email: 'carlos.mendez@student.hkr.se',
      baseCurrency: 'USD',
      country: 'Sweden'
    });

    const accountsData = [
      {
        userId: user._id,
        name: 'Swedbank savings',
        type: 'savings',
        country: 'Sweden',
        currency: 'SEK',
        balance: 63440,
        institution: 'Swedbank'
      },
      {
        userId: user._id,
        name: 'Avanza portfolio',
        type: 'investment',
        country: 'Sweden',
        currency: 'SEK',
        balance: 98200,
        institution: 'Avanza'
      },
      {
        userId: user._id,
        name: 'Banco Pichincha',
        type: 'savings',
        country: 'Ecuador',
        currency: 'USD',
        balance: 4900,
        institution: 'Banco Pichincha'
      },
      {
        userId: user._id,
        name: 'Produbanco investment',
        type: 'investment',
        country: 'Ecuador',
        currency: 'USD',
        balance: 5000,
        institution: 'Produbanco'
      },
      {
        userId: user._id,
        name: 'Cash on hand',
        type: 'cash',
        country: 'Sweden',
        currency: 'SEK',
        balance: 3200,
        institution: 'N/A'
      }
    ];

    const createdAccounts = await Account.insertMany(accountsData);

    const exchangeRates = {
      SEK: 0.0978,
      USD: 1
    };

    const snapshots = [];

    createdAccounts.forEach((account) => {
      for (let i = 6; i >= 1; i--) {
        const historicalBalance =
          account.balance * (1 - i * 0.05 + Math.random() * 0.05);

        const rate = exchangeRates[account.currency];
        const balanceUSD = Number((historicalBalance * rate).toFixed(2));

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
    console.log(`Inserted 1 user, ${createdAccounts.length} accounts, ${snapshots.length} snapshots.`);
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    process.exit();
  }
};

seedDatabase();