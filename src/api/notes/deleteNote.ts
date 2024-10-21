export async function deleteNote(noteId: string): Promise<void> {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        // If no token is found, throw an error
        throw new Error('No authentication token found. Please log in.');
    }

    try {
        // Send a DELETE request to the backend to delete a note by its ID
        const response = await fetch(`https://backend-profit-lost-com.onrender.com/notes/${noteId}`, {
            method: 'DELETE', // Specify the HTTP method as DELETE
            headers: {
                'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
            },
        });

        // If the response status is not OK, read and throw an error
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        // Log the error to the console and rethrow it for handling elsewhere
        console.error('Error deleting note:', error);
        throw error;
    }
}
