import { useState } from 'react';

export default function AccountRow({ account, onEdit, onDelete }) {
  // Keeping track of loading state specifically for the delete button so UI doesn't freeze weirdly
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Giving the classic window confirmation so users don't accidentally delete financial data
    const confirmDelete = window.confirm(`Are you sure you want to delete ${account.name}?`);
    
    if (confirmDelete) {
      setIsDeleting(true);
      await onDelete(account._id);
    }
  };

  return (
    <tr>
      <td>{account.name}</td>
      <td style={{ textTransform: 'capitalize' }}>{account.type}</td>
      <td>{account.country}</td>
      <td>{account.currency}</td>
      <td>{account.balance}</td>
      <td>{account.institution}</td>
      <td>
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
  );
}
