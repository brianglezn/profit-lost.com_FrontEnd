import Note from '../../helpers/types';

interface EditNotePayload {
    title: string;  // The title of the note to update
    content: string;  // The content of the note to update
}

// Function to edit an existing note by sending a PUT request to the server
export async function editNote(noteId: string, payload: EditNotePayload): Promise<Note> {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('token');
    
    // If there is no token, throw an error indicating the user is not logged in
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }

    try {
        // Send a PUT request to the API endpoint for updating the note
        const response = await fetch(`https://app-profit-lost-com.onrender.com/notes/${noteId}`, {
            method: 'PUT',  // Specify the HTTP method as PUT for updating
            headers: {
                'Authorization': `Bearer ${token}`,  // Include the token for authentication
                'Content-Type': 'application/json',  // Set the content type to JSON
            },
            // Convert the updated note data (payload) to a JSON string to be sent in the request body
            body: JSON.stringify(payload),
        });

        // If the response is not successful, throw an error with the response message or status
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        // Parse and return the updated note from the API response
        return await response.json();
    } catch (error) {
        // Log any errors to the console for debugging and rethrow the error
        console.error('Error editing note:', error);
        throw error;
    }
}
