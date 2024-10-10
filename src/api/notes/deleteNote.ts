export async function deleteNote(noteId: string): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }

    try {
        const response = await fetch(`https://app-profit-lost-com.onrender.com/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
}
