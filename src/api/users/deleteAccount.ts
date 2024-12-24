export const deleteAccount = async (token: string) => {
    try {
        // Send a DELETE request to the server to delete the user's account
        const response = await fetch('https://sound-harlene-brian-novoa-be9c1292.koyeb.app/api/user/deleteAccount', {
            method: 'DELETE', // HTTP method DELETE is used for removing a resource
            headers: {
                Authorization: `Bearer ${token}`, // Include the authorization token to authenticate the user
            },
        });

        // Check if the response from the server is not OK (status code outside 200-299 range)
        if (!response.ok) {
            throw new Error('Failed to delete account'); // Throw an error if account deletion fails
        }

        return response; // Return the response if successful
    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error('Error deleting account:', error);

        // Throw a new error to be caught by any calling functions
        throw new Error('Failed to delete account');
    }
};
