export const deleteProfileImage = async () => {
    try {
        // Send a POST request to the server to delete the user's profile image
        const response = await fetch('https://sound-harlene-brian-novoa-be9c1292.koyeb.app/user/deleteProfileImage', {
            method: 'POST', // HTTP method POST is used for this specific action
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Attach the authorization token from localStorage
            },
        });

        // Check if the response status is not OK (status code outside the 200-299 range)
        if (!response.ok) {
            throw new Error('Failed to delete profile image'); // Throw an error if the deletion request fails
        }

        // Parse the response body as JSON
        const data = await response.json();
        return data; // Return the response data if successful
    } catch (error) {
        // Determine the error message, depending on whether the caught error is an instance of Error
        const errorMessage = error instanceof Error ? error.message : 'Error deleting profile image';

        // Throw a new error to be handled by calling functions
        throw new Error(errorMessage);
    }
};
