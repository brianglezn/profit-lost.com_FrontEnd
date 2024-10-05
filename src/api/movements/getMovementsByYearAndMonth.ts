export const getMovementsByYearAndMonth = async (token: string, year: string, month: string) => {
    try {
        // Send a GET request to fetch movements for a specific year and month
        const response = await fetch(`https://app-profit-lost-com.onrender.com/movements/${year}/${month}`, {
            method: 'GET', // HTTP GET method to retrieve data
            headers: {
                'Authorization': `Bearer ${token}`, // Include the authorization token for authentication
                'Content-Type': 'application/json', // Indicate that the response is expected to be in JSON format
            },
        });

        // Check if the response status is not OK and throw an error if the request fails
        if (!response.ok) {
            throw new Error('Network response was not ok'); // Throw an error if the response status is not successful
        }

        // Parse the response as JSON to extract the list of movements
        const movements = await response.json();
        return movements; // Return the fetched movements data
    } catch (error) {
        // Log any error that occurs during the request to the console for debugging purposes
        console.error('There was an error fetching the movements for the specified year and month:', error);
        throw new Error('Failed to fetch movements for the specified year and month'); // Throw an error indicating failure to fetch movements
    }
};
