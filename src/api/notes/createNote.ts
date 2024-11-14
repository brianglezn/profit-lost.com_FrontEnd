import { Note } from '../../helpers/types';

interface CreateNotePayload {
    title: string;
    content: string;
}

// Function to create a new note by sending a POST request to the backend
export async function createNote(payload: CreateNotePayload): Promise<Note> {
    try {
        const response = await fetch('https://backend-profit-lost-com.onrender.com/notes', {
            method: 'POST',
            credentials: 'include',  // Include cookies for authentication
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating note:', error);
        throw error;
    }
}
