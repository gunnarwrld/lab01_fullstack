import React, { useState } from 'react';
import { getAccountSnapshots } from '../api';

export default function AccountRow({ account, onEdit, onDelete }) {
  // Keeping track of loading state specifically for the delete button so UI doesn't freeze weirdly
  const [isDeleting, setIsDeleting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [snapshots, setSnapshots] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const handleDelete = async () => {
    // Giving the classic window confirmation so users don't accidentally delete financial data
    const confirmDelete = window.confirm(`Are you sure you want to delete ${account.name}?`);
    
    if (confirmDelete) {
      setIsDeleting(true);
      await onDelete(account._id);
    }
  };

  const toggleHistory = async () => {
    if (!showHistory) {
      setLoadingHistory(true);
      try {
        const data = await getAccountSnapshots(account._id);
        setSnapshots(data);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoadingHistory(false);
      }
    }
    setShowHistory(!showHistory);
  };

  return (
    <>
      <tr>
        <td>
          {account.name}
          {account.userId && account.userId.name && (
            <span style={{ fontSize: '0.8em', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px', color: '#475569' }}>
              👤 {account.userId.name}
            </span>
          )}
        </td>
        <td style={{ textTransform: 'capitalize' }}>{account.type}</td>
        <td>{account.country}</td>
        <td>{account.currency}</td>
        <td>{account.balance}</td>
        <td>{account.institution}</td>
        <td>
          <button 
            onClick={toggleHistory}
            style={{ marginRight: '5px' }}
          >
            History
          </button>
          <button 
            onClick={() => onEdit(account)} 
            style={{ marginRight: '5px' }}
            disabled={isDeleting}
          >
            Edit
          </button>
          <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            style={{ color: 'white', backgroundColor: 'red', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}
          >
            {isDeleting ? '...' : 'Delete'}
          </button>
        </td>
      </tr>
      {showHistory && (
        <tr style={{ backgroundColor: '#f8fafc' }}>
          <td colSpan="7" style={{ padding: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Snapshot History</h4>
            {loadingHistory ? (
              <p>Loading...</p>
            ) : snapshots.length === 0 ? (
              <p>No snapshots found for this account.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                    <th style={{ textAlign: 'left', padding: '4px' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '4px' }}>Balance (USD)</th>
                    <th style={{ textAlign: 'left', padding: '4px' }}>Exchange Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshots.map(snap => (
                    <tr key={snap._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '4px' }}>{new Date(snap.recordedAt).toLocaleString()}</td>
                      <td style={{ padding: '4px' }}>${snap.balanceUSD.toFixed(2)}</td>
                      <td style={{ padding: '4px' }}>{snap.exchangeRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
