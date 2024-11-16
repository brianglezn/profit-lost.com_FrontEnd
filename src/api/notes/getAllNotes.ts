import { Note } from '../../helpers/types';

// Function to fetch all notes from the API
export async function getAllNotes(): Promise<Note[]> {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('token');

    // If no token is found, throw an authentication error
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }

    try {
        // Make a GET request to the notes API with the Bearer token in the Authorization header
        const response = await fetch('https://backend-profit-lost-com.onrender.com/notes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        // Check if the response is not OK (status outside the range 200-299)
        if (!response.ok) {
            // Try to read the error message from the response body
            const errorText = await response.text();
            // Throw an error with the message or the status code if no message is available
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        // Parse and return the JSON response containing the list of notes
        return await response.json();
    } catch (error) {
        // Log any errors to the console for debugging purposes
        console.error('Error fetching notes:', error);
        // Rethrow the error to propagate it to the calling function
        throw error;
    }
}
