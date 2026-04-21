import { useState } from 'react';
import AccountList from './components/AccountList';
import AccountForm from './components/AccountForm';
import { createAccount, updateAccount } from './api';

function App() {
  const [error, setError] = useState(null);
  
  // I need state to temporarily hold the data of the account the user clicked "Edit" on
  const [editingAccount, setEditingAccount] = useState(null);

  const handleCreateOrUpdateAccount = async (accountData) => {
    try {
      setError(null);
      
      if (editingAccount) {
        // If I am editing, call the update API
        await updateAccount(editingAccount._id, accountData);
        setEditingAccount(null); // Clear edit mode cleanly
      } else {
        // Otherwise it's a completely new account
        await createAccount(accountData);
      }
      
      // Right now I am still doing a crude reload to reset the state locally 
      // but the table auto-fetches underneath on an interval!
      window.location.reload(); 
    } catch (err) {
      setError(err.message);
    }
  };

  // I trigger this from AccountList > AccountRow when someone clicks 'Edit'
  const handleEditClick = (account) => {
    setEditingAccount(account);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Global Net Worth Tracker</h1>
      
      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
      
      <AccountForm 
        onSubmit={handleCreateOrUpdateAccount} 
        initialData={editingAccount} 
      />
      
      <AccountList onEditAccount={handleEditClick} />
    </div>
  );
}

export default App;
