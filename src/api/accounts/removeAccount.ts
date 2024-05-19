export async function removeAccount(accountId: string): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }

    console.log('Removing account with ID:', accountId);

    try {
        const response = await fetch(`https://profit-lost-backend.onrender.com/accounts/remove/${accountId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        console.log('Account removed successfully');
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
}
