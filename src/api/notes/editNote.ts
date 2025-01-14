import { Note } from '../../helpers/types';

interface EditNotePayload {
    title: string;  // The title of the note to be edited
    content: string;  // The content of the note to be edited
}

// Function to edit an existing note
export async function editNote(noteId: string, payload: EditNotePayload): Promise<Note> {
    const token = localStorage.getItem('token');  // Retrieve the token from localStorage for authentication
    if (!token) {
        // Throw an error if no token is found
        throw new Error('No authentication token found. Please log in.');
    }

    try {
        // Send a PUT request to the server to update the note with the given noteId
        const response = await fetch(`https://written-ashia-profit-lost-6f7f84ee.koyeb.app/api/notes/${noteId}`, {
            method: 'PUT',  // Use the PUT method to update the resource
            headers: {
                'Authorization': `Bearer ${token}`,  // Add the Bearer token for authentication
                'Content-Type': 'application/json',  // Specify the content type as JSON
            },
            body: JSON.stringify(payload),  // Send the updated note data in the request body
        });

        // Check if the request was successful (status code 2xx)
        if (!response.ok) {
            const errorText = await response.text();  // Retrieve the error message
            // Throw an error with the retrieved message or a default error based on the status code
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        // Parse and return the updated note from the response
        return await response.json();
    } catch (error) {
        // Log any errors that occurred during the request and rethrow them
        console.error('Error editing note:', error);
        throw error;
    }
}
