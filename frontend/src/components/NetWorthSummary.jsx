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
    <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
      <h2 style={{ marginTop: 0, color: '#2c3e50' }}>Total Net Worth: ${stats.totalUSD} USD</h2>
      
      <div style={{ display: 'flex', gap: '40px' }}>
        <div>
          <h3 style={{ borderBottom: '2px solid #ccc', paddingBottom: '5px' }}>By Country (USD)</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {Object.entries(stats.byCountry).map(([country, amount]) => (
              <li key={country} style={{ marginBottom: '5px' }}>
                <strong>{country}:</strong> ${amount}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 style={{ borderBottom: '2px solid #ccc', paddingBottom: '5px' }}>By Asset Type (USD)</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {Object.entries(stats.byType).map(([type, amount]) => (
              <li key={type} style={{ textTransform: 'capitalize', marginBottom: '5px' }}>
                <strong>{type}:</strong> ${amount}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
