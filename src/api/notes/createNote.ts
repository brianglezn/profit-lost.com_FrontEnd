import Note from '../../helpers/types';

interface CreateNotePayload {
    title: string;
    content: string;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }

    try {
        const response = await fetch('https://app-profit-lost-com.onrender.com/notes', {
            method: 'POST',
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
        console.error('Error creating note:', error);
        throw error;
    }
}
