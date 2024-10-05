export const removeMovement = async (token: string, movementId: string) => {
    try {
        // Send a DELETE request to remove a specific movement by its ID
        const response = await fetch(`https://app-profit-lost-com.onrender.com/movements/remove/${movementId}`, {
            method: 'DELETE', // HTTP DELETE method to remove the movement
            headers: {
                'Authorization': `Bearer ${token}`, // Include the authorization token for authentication
                'Content-Type': 'application/json', // Indicate the content type is JSON
            },
        });

        // Check if the response is not OK and throw an error if the request fails
        if (!response.ok) {
            throw new Error('Failed to remove movement'); // Throw an error if the response status is not successful
        }

        return 'Movement removed successfully'; // Return a success message if the removal was successful
    } catch (error) {
        // Log any error that occurs during the request to the console for debugging purposes
        console.error('Error removing movement:', error);
        throw new Error('Failed to remove movement'); // Throw an error indicating failure to remove the movement
    }
};
