export const getUserByToken = async (token: string) => {
    try {
        // Send a GET request to the server to fetch the user's information
        const response = await fetch('https://sound-harlene-brian-novoa-be9c1292.koyeb.app/api/user/me', {
            method: 'GET', // HTTP method GET is used to retrieve data
            headers: {
                'Authorization': `Bearer ${token}`, // Attach the authorization token for user identification
            },
        });

        // Check if the response is not OK (status code outside the 200-299 range)
        if (!response.ok) {
            throw new Error('Failed to fetch user information'); // Throw an error if the request fails
        }

        // Parse the response body as JSON to get the user's information
        const user = await response.json();
        return user; // Return the user's information if the request was successful

    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error('Error fetching user information:', error);

        // Throw a new error to be handled by calling functions
        throw new Error('Failed to fetch user information');
    }
};
