export async function deleteNote(noteId: string): Promise<void> {
    try {
        // Send a DELETE request to delete a note by its ID
        const response = await fetch(`https://backend-profit-lost-com.onrender.com/notes/${noteId}`, {
            method: 'DELETE',
            credentials: 'include',  // Include cookies for authentication
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
