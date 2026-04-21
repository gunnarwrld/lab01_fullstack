import { useState } from 'react';
import AccountList from './components/AccountList';
import AccountForm from './components/AccountForm';
import { createAccount } from './api';

function App() {
  const [error, setError] = useState(null);

  // This handles the form submission flowing upward from my AccountForm component
  const handleCreateAccount = async (accountData) => {
    try {
      setError(null);
      await createAccount(accountData);
      
      // I am doing a crude page reload right now to reflect new data instead of state management.
      // On Day 5, I will implement the proper setInterval polling to auto-refresh this cleanly!
      window.location.reload(); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Global Net Worth Tracker</h1>
      
      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
      
      <AccountForm onSubmit={handleCreateAccount} />
      <AccountList />
    </div>
  );
}

export default App;
