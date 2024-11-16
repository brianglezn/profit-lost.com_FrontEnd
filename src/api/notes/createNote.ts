import { Note } from '../../helpers/types';

// Define the structure for the payload needed to create a new note
interface CreateNotePayload {
    title: string;
    content: string;
}

// Function to create a new note by sending a POST request to the backend
export async function createNote(payload: CreateNotePayload): Promise<Note> {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        // If no token is found, throw an error
        throw new Error('No authentication token found. Please log in.');
    }

    try {
        // Send a POST request to the backend to create a new note
        const response = await fetch('https://backend-profit-lost-com.onrender.com/notes', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload), // Convert the note data (title, content) to JSON
        });

        // If the response status is not OK, read and throw an error
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        // Parse and return the response as a Note object
        return await response.json();
    } catch (error) {
        // Log the error to the console and rethrow it for handling elsewhere
        console.error('Error creating note:', error);
        throw error;
    }
}
