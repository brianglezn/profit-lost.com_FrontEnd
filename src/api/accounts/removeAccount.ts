export async function removeAccount(accountId: string): Promise<void> {
    // Retrieve the authentication token from local storage
    const token = localStorage.getItem('token');
    if (!token) {
        // If the token is not found, throw an error
        throw new Error('No authentication token found. Please log in.');
    }

    try {
        // Send a DELETE request to the API to remove the specified account
        const response = await fetch(`https://sound-harlene-brian-novoa-be9c1292.koyeb.app/accounts/remove/${accountId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Authorization token is needed for authentication
            },
        });

        // If the response is not successful, throw an error with details from the response
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        // Log any errors to the console for debugging
        console.error('Error deleting account:', error);
        // Re-throw the error to allow the calling function to handle it
        throw error;
    }
}
