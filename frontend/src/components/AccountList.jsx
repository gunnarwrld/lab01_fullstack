import { useState, useEffect } from 'react';
import { getAccounts, deleteAccount } from '../api';
import AccountRow from './AccountRow';

export default function AccountList({ onEditAccount, refreshTrigger }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom interactive features requested by lab: Filter and Sort
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

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
      await fetchAccounts(false);
    } catch (err) {
      alert("Failed to delete account: " + err.message);
    }
  };

  useEffect(() => {
    fetchAccounts();
    const intervalId = setInterval(() => {
      fetchAccounts(false);
    }, 30000);
    return () => clearInterval(intervalId);
  }, [refreshTrigger]);

  // I handle sorting when a user clicks a table header
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // I apply my search filter first
  const filteredAccounts = accounts.filter(acc => 
    acc.country.toLowerCase().includes(searchTerm.toLowerCase()) || 
    acc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Then I apply my sorting mechanism
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  if (loading) return <p>Loading my accounts...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="account-list" style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#0f172a' }}>My Financial Accounts</h2>
        
        {/* Search Input for custom interactive feature */}
        <input 
          type="text" 
          placeholder="Search by country or type..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control search-bar"
          style={{ margin: 0 }}
        />
      </div>
      
      {sortedAccounts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: '#64748b' }}>
            <p>No accounts found matching your filter.</p>
          </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
              <thead>
              <tr>
                  {/* Clickable headers for sorting */}
                  <th onClick={() => requestSort('name')}>Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}</th>
                  <th onClick={() => requestSort('type')}>Type {sortConfig.key === 'type' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}</th>
                  <th onClick={() => requestSort('country')}>Country {sortConfig.key === 'country' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}</th>
                  <th onClick={() => requestSort('currency')}>Currency {sortConfig.key === 'currency' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}</th>
                  <th onClick={() => requestSort('balance')}>Balance {sortConfig.key === 'balance' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}</th>
                  <th>Institution</th>
                  <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {sortedAccounts.map(acc => (
                  <AccountRow 
                      key={acc._id} 
                      account={acc} 
                      onEdit={onEditAccount} 
                      onDelete={handleDeleteAccount} 
                  />
              ))}
              </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
