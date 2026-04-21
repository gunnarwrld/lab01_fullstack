import { useState, useEffect } from 'react';

// I use a controlled component pattern here to manage form state
export default function AccountForm({ onSubmit, initialData = null }) {
  // Setting up my initial state for all required fields
  const [formData, setFormData] = useState({
    name: '',
    type: 'savings',
    country: '',
    currency: 'USD',
    balance: '',
    institution: ''
  });

  // If I decide to edit an account later (Day 5), I need this to pre-fill the form
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    // I dynamically update the specific field in my state object based on the input name
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // I don't want the page to force-reload on submit
    
    // I pass the data back up to the parent component
    // I also need to make sure the balance is cast strictly to a Number for my math to work later
    onSubmit({ ...formData, balance: Number(formData.balance) });
    
    // Reset my form after submission if it's a new account creation
    if (!initialData) {
      setFormData({
        name: '', type: 'savings', country: '', currency: 'USD', balance: '', institution: ''
      });
    }
  };

  return (
    <div className="account-form">
      <h3>{initialData ? 'Edit Account' : 'Add New Account'}</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input 
            type="text" name="name" placeholder="Account Name" 
            value={formData.name} onChange={handleChange} required 
        />
        
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="savings">Savings</option>
          <option value="investment">Investment</option>
          <option value="cash">Cash</option>
        </select>

        <input 
            type="text" name="country" placeholder="Country" 
            value={formData.country} onChange={handleChange} required 
        />

        <select name="currency" value={formData.currency} onChange={handleChange}>
          <option value="USD">USD</option>
          <option value="SEK">SEK</option>
          <option value="EUR">EUR</option>
        </select>

        <input 
            type="number" name="balance" placeholder="Balance" 
            value={formData.balance} onChange={handleChange} min="0" required 
        />

        <input 
            type="text" name="institution" placeholder="Institution (e.g. Swedbank)" 
            value={formData.institution} onChange={handleChange} required 
        />

        <button type="submit">{initialData ? 'Update Account' : 'Create Account'}</button>
      </form>
    </div>
  );
}
