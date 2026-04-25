// I centralized all my fetch logic here so I don't clutter my React components
const BASE = 'http://localhost:8000/api';

export const getAccounts = async (filters = {}) => {
  // I construct query parameters if filters are passed
  const query = new URLSearchParams(filters).toString();
  const url = query ? `${BASE}/accounts?${query}` : `${BASE}/accounts`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch accounts');
  return response.json();
};

export const createAccount = async (data) => {
  // Do not hardcode userId here. Backend will assign or use an existing user when missing.
  const response = await fetch(`${BASE}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error('Failed to create account: ' + errText);
  }
  return response.json();
};

export const updateAccount = async (id, data) => {
  const response = await fetch(`${BASE}/accounts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update account');
  return response.json();
};

export const deleteAccount = async (id) => {
  const response = await fetch(`${BASE}/accounts/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete account');
  return response.json();
};

export const getNetWorth = async () => {
  const response = await fetch(`${BASE}/stats/networth`);
  if (!response.ok) throw new Error('Failed to fetch net worth');
  return response.json();
};

export const getAccountSnapshots = async (accountId) => {
  const response = await fetch(`${BASE}/snapshots?accountId=${accountId}`);
  if (!response.ok) throw new Error('Failed to fetch snapshots');
  return response.json();
};
