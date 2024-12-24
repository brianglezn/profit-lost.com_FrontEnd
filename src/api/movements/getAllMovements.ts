export const getAllMovements = async (token: string) => {
    try {
        // Send a GET request to fetch all movements
        const response = await fetch('https://sound-harlene-brian-novoa-be9c1292.koyeb.app/api/movements/all', {
            method: 'GET', // HTTP GET method to retrieve data
            headers: {
                'Authorization': `Bearer ${token}`, // Include the authorization token for authentication
                'Content-Type': 'application/json', // Indicate that the response is in JSON format
            },
        });

        // Check if the response status is not OK, and throw an error if it fails
        if (!response.ok) {
            throw new Error('Network response was not ok'); // Throw an error if the response is not successful
        }

        // Parse the response as JSON to get the list of movements
        const movements = await response.json();
        return movements; // Return the fetched movements data
    } catch (error) {
        // Log any error to the console for debugging purposes
        console.error('There was an error fetching the movements:', error);
        throw new Error('Failed to fetch movements'); // Throw an error indicating failure to fetch movements
    }
};
