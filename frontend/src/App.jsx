import { useState } from 'react';
import AccountList from './components/AccountList';
import AccountForm from './components/AccountForm';
import NetWorthSummary from './components/NetWorthSummary';
import { createAccount, updateAccount } from './api';

function App() {
  const [error, setError] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateOrUpdateAccount = async (accountData) => {
    try {
      setError(null);
      
      if (editingAccount) {
        await updateAccount(editingAccount._id, accountData);
        setEditingAccount(null); 
      } else {
        await createAccount(accountData);
      }
      
      setRefreshTrigger(prev => prev + 1); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (account) => {
    setEditingAccount(account);
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-title">Global Net Worth Tracker</h1>
      </div>
      
      <NetWorthSummary />
      
      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
      
      <div className="card">
        <AccountForm 
            onSubmit={handleCreateOrUpdateAccount} 
            initialData={editingAccount} 
        />
      </div>
      
      <AccountList onEditAccount={handleEditClick} refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default App;
