export const addMovement = async (token: string, movementData: {
    date: string,
    description: string,
    amount: number,
    category: string
}) => {
    try {
        // Send a POST request to add a new movement
        const response = await fetch('https://sound-harlene-brian-novoa-be9c1292.koyeb.app/movements/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the authorization token for authentication
                'Content-Type': 'application/json', // Indicate that the body content is in JSON format
            },
            body: JSON.stringify(movementData), // Convert the movement data object to JSON for the request body
        });

        // Check if the response status is not OK, and throw an error if it fails
        if (!response.ok) {
            throw new Error('Failed to add movement'); // Throw an error if the addition fails
        }

        // Parse the response as JSON to get the newly created movement
        const newMovement = await response.json();
        return newMovement; // Return the new movement if the request is successful
    } catch (error) {
        // Log any error to the console for debugging purposes
        console.error('Error adding new movement:', error);
        // Throw a new error indicating failure to add the movement
        throw new Error('Failed to add movement');
    }
};
