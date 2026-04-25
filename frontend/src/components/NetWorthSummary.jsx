import { useState, useEffect } from 'react';
import { getNetWorth } from '../api';

export default function NetWorthSummary() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // I fetch my complex MongoDB aggregation via my stats endpoint
    const fetchStats = async () => {
      try {
        const data = await getNetWorth();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
    
    // Auto refresh my stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading net worth statistics...</p>;
  if (error) return <p style={{ color: 'red' }}>Error loading stats: {error}</p>;
  if (!stats) return null;

  return (
    <div className="card">
      <h2 className="summary-header">Total Net Worth: ${stats.totalUSD.toLocaleString()}</h2>
      
      <div className="summary-grid">
        <div className="summary-block">
          <h3>By Country</h3>
          <ul className="summary-list">
            {Object.entries(stats.byCountry).map(([country, amount]) => (
              <li key={country}>
                <span>{country}</span> <strong>${amount.toLocaleString()}</strong>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="summary-block">
          <h3>By Asset Type</h3>
          <ul className="summary-list">
            {Object.entries(stats.byType).map(([type, amount]) => (
              <li key={type} style={{ textTransform: 'capitalize' }}>
                <span>{type}</span> <strong>${amount.toLocaleString()}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
