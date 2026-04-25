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
        <td style={{ fontWeight: '500', color: '#0f172a' }}>
          {account.name}
          {account.userId && account.userId.name && (
            <span className="badge">
              👤 {account.userId.name}
            </span>
          )}
        </td>
        <td style={{ textTransform: 'capitalize' }}>
          <span style={{ 
            backgroundColor: account.type === 'savings' ? '#e0f2fe' : account.type === 'investment' ? '#fce7f3' : '#fef3c7',
            color: account.type === 'savings' ? '#0369a1' : account.type === 'investment' ? '#be185d' : '#b45309',
            padding: '4px 8px', borderRadius: '4px', fontSize: '0.85em', fontWeight: '500'
          }}>
            {account.type}
          </span>
        </td>
        <td>{account.country}</td>
        <td><span className="badge" style={{ backgroundColor: '#e2e8f0' }}>{account.currency}</span></td>
        <td style={{ fontWeight: '600' }}>{account.balance.toLocaleString()}</td>
        <td>{account.institution}</td>
        <td>
          <div className="actions">
            <button 
              onClick={toggleHistory}
              className="btn-secondary"
            >
              History
            </button>
            <button 
              onClick={() => onEdit(account)} 
              className="btn-primary"
              disabled={isDeleting}
            >
              Edit
            </button>
            <button 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="btn-danger"
            >
              {isDeleting ? '...' : 'Delete'}
            </button>
          </div>
        </td>
      </tr>
      {showHistory && (
        <tr className="history-row">
          <td colSpan="7" style={{ padding: 0 }}>
            <div className="history-container">
              <h4>Snapshot History</h4>
              {loadingHistory ? (
                <p style={{ color: '#64748b' }}>Loading history...</p>
              ) : snapshots.length === 0 ? (
                <p style={{ color: '#64748b' }}>No snapshots found for this account.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table" style={{ fontSize: '0.9em', margin: 0, boxShadow: 'none', border: '1px solid var(--border)' }}>
                    <thead>
                      <tr>
                        <th>Date Recorded</th>
                        <th>Balance (USD)</th>
                        <th>Exchange Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {snapshots.map(snap => (
                        <tr key={snap._id}>
                          <td>{new Date(snap.recordedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</td>
                          <td style={{ fontWeight: '600' }}>${snap.balanceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td>{snap.exchangeRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
