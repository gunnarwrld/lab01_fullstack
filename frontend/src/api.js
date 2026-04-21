// I centralized all my fetch logic here so I don't clutter my React components
const BASE = 'http://localhost:5000/api';

export const getAccounts = async (filters = {}) => {
  // I construct query parameters if filters are passed
  const query = new URLSearchParams(filters).toString();
  const url = query ? `${BASE}/accounts?${query}` : `${BASE}/accounts`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch accounts');
  return response.json();
};

export const createAccount = async (data) => {
  // I must include the hardcoded user ID here since we do not have an auth system built out
  // NOTE: This ID will fail if the user's ID from seeding is different. 
  // In a real application, I would pass the logged-in user's ID.
  const authPayload = { ...data, userId: "60b8c62b5d4b5c1c8c8b4567" }; // We'll handle grabbing the exact ID when we bind it to the App state.

  const response = await fetch(`${BASE}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(authPayload)
  });
  if (!response.ok) throw new Error('Failed to create account');
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
