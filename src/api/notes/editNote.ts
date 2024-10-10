
import Note from '../../helpers/types';

interface EditNotePayload {
    title: string;
    content: string;
}

export async function editNote(noteId: string, payload: EditNotePayload): Promise<Note> {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }

    try {
        const response = await fetch(`https://app-profit-lost-com.onrender.com/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
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
