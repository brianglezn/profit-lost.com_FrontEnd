import { Note } from '../../helpers/types';

interface EditNotePayload {
    title: string;
    content: string;
}

// Function to edit an existing note
export async function editNote(noteId: string, payload: EditNotePayload): Promise<Note> {
    try {
        // Send a PUT request to update the note with the given noteId
        const response = await fetch(`https://backend-profit-lost-com.onrender.com/notes/${noteId}`, {
            method: 'PUT',
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
        console.error('Error editing note:', error);
        throw error;
    }
}
