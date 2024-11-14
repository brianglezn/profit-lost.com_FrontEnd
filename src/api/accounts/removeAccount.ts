export async function removeAccount(accountId: string): Promise<void> {
    try {
        // Send a DELETE request to the API to remove the specified account with cookies included
        const response = await fetch(`https://backend-profit-lost-com.onrender.com/accounts/remove/${accountId}`, {
            method: 'DELETE',
            credentials: 'include', // Include cookies for authentication
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
