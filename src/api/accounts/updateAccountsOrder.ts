export const updateAccountsOrder = async (accountsOrder: string[]): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }
  
    try {
      const response = await fetch('https://profit-lost-backend.onrender.com/user/updateAccountsOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ accountsOrder }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
  
    } catch (error) {
      console.error('Error updating accounts order:', error);
      throw error;
    }
  };
  
  export default updateAccountsOrder;
  