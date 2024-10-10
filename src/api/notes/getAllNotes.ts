import Note from '../../helpers/types';

export async function getAllNotes(): Promise<Note[]> {  // Corregimos a Note[]
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }

    try {
        const response = await fetch('https://app-profit-lost-com.onrender.com/notes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        return await response.json();  // Retornamos un array de notas
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }
}
