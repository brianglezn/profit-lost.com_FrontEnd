export const updateAccountsOrder = async (accountsOrder: string[]): Promise<void> => {
  // Retrieve the authentication token from local storage
  const token = localStorage.getItem('token');
  if (!token) {
    // If no token is found, throw an error indicating the user needs to log in
    throw new Error('No authentication token found. Please log in.');
  }

  try {
    // Make a POST request to update the user's account order
    const response = await fetch('https://app-profit-lost-com.onrender.com/user/updateAccountsOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify JSON format for request body
        'Authorization': `Bearer ${token}`, // Include the authorization token
      },
      body: JSON.stringify({ accountsOrder }), // Send the new accounts order as the request body
    });

    // Check if the response status is not OK and handle accordingly
    if (!response.ok) {
      const errorText = await response.text(); // Retrieve error text from the response
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error updating accounts order:', error);
    // Re-throw the error so it can be handled by the calling function
    throw error;
  }
};

export default updateAccountsOrder;
