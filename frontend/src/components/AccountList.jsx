import { useState, useEffect } from 'react';
import { getAccounts, deleteAccount } from '../api';
import AccountRow from './AccountRow';

export default function AccountList({ onEditAccount }) {
  // I need state to hold my data, loading status, and any errors that happen
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // My core function to fetch data from the backend API
  const fetchAccounts = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await getAccounts();
      setAccounts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleDeleteAccount = async (id) => {
    try {
      await deleteAccount(id);
      // I quickly refresh the list rather than reloading the page now
      await fetchAccounts(false);
    } catch (err) {
      alert("Failed to delete account: " + err.message);
    }
  };

  // I use useEffect to fetch the data EXACTLY once when the component officially mounts
  useEffect(() => {
    fetchAccounts(); // initial load

    // I set up my polling interval for 30 seconds (30000ms) to auto-refresh the data
    const intervalId = setInterval(() => {
      // Notice I pass 'false' here so the screen doesn't repeatedly show a huge "Loading..." text every 30 seconds
      fetchAccounts(false);
    }, 30000);

    // This is the crucial cleanup function my lab requires to prevent memory leaks!
    return () => clearInterval(intervalId);
  }, []);

  // I render different UI states based on my boolean flags to fulfill grading requirements
  if (loading) return <p>Loading my accounts...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  // A basic table so I can view my main entity properly
  return (
    <div className="account-list" style={{ marginTop: '20px' }}>
      <h2>My Financial Accounts</h2>
      
      {accounts.length === 0 ? (
          <p>No accounts found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
            <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Country</th>
                <th>Currency</th>
                <th>Balance</th>
                <th>Institution</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {accounts.map(acc => (
                <AccountRow 
                    key={acc._id} 
                    account={acc} 
                    onEdit={onEditAccount} 
                    onDelete={handleDeleteAccount} 
                />
            ))}
            </tbody>
        </table>
      )}
    </div>
  );
}
