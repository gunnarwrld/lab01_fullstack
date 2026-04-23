import { useState } from 'react';
import AccountList from './components/AccountList';
import AccountForm from './components/AccountForm';
import NetWorthSummary from './components/NetWorthSummary';
import { createAccount, updateAccount } from './api';

function App() {
  const [error, setError] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);

  const handleCreateOrUpdateAccount = async (accountData) => {
    try {
      setError(null);
      
      if (editingAccount) {
        await updateAccount(editingAccount._id, accountData);
        setEditingAccount(null); 
      } else {
        await createAccount(accountData);
      }
      
      window.location.reload(); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (account) => {
    setEditingAccount(account);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#2c3e50', borderBottom: '3px solid #3498db', paddingBottom: '10px' }}>Global Net Worth Tracker</h1>
      
      <NetWorthSummary />
      
      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
      
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <AccountForm 
            onSubmit={handleCreateOrUpdateAccount} 
            initialData={editingAccount} 
        />
      </div>
      
      <AccountList onEditAccount={handleEditClick} />
    </div>
  );
}

export default App;
