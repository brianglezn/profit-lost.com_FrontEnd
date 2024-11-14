import { Note } from '../../helpers/types';

// Function to fetch all notes from the API
export async function getAllNotes(): Promise<Note[]> {
    try {
        // Make a GET request to the notes API with credentials included
        const response = await fetch('https://backend-profit-lost-com.onrender.com/notes', {
            method: 'GET',
            credentials: 'include',  // Include cookies for authentication
        });

        // Check if the response is not OK
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        // Parse and return the JSON response containing the list of notes
        return await response.json();
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }
}
