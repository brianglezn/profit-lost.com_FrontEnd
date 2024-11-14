export const editMovement = async (
    movementId: string,
    movementData: {
        date: string,
        description: string,
        amount: number,
        category: string
    }
) => {
    try {
        // Send a PUT request to edit an existing movement with credentials included
        const response = await fetch(`https://backend-profit-lost-com.onrender.com/movements/edit/${movementId}`, {
            method: 'PUT', // HTTP method 'PUT' is used to update existing data
            credentials: 'include', // Include cookies for authentication
            headers: {
                'Content-Type': 'application/json', // Indicate that the body content is in JSON format
            },
            body: JSON.stringify(movementData), // Convert the movement data object to JSON for the request body
        });

        // Check if the response status is not OK, and throw an error if it fails
        if (!response.ok) {
            const errorText = await response.text(); // Read the response text if the request fails
            console.error('Error text:', errorText); // Log the error response text for debugging
            throw new Error(errorText || 'Failed to edit movement'); // Throw an error indicating failure
        }

        // Check if the response content type is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const updatedMovement = await response.json(); // Parse the response as JSON
            return updatedMovement; // Return the updated movement data
        } else {
            // If the response is not JSON, read it as plain text
            const textResponse = await response.text();
            return textResponse; // Return the text response
        }
    } catch (error) {
        // Log any error to the console for debugging purposes
        console.error('Error editing movement:', error);
        throw new Error('Failed to edit movement'); // Throw an error indicating failure to edit movement
    }
};
