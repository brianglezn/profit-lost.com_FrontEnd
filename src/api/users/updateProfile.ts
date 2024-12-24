export const updateProfile = async (userData: FormData) => {
    try {
        // Send a POST request to update the user's profile
        const response = await fetch('https://sound-harlene-brian-novoa-be9c1292.koyeb.app/api/user/updateProfile', {
            method: 'POST', // HTTP POST method to submit the updated profile data
            body: userData, // Attach the user profile data (includes form data such as files)
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Authorization token for user authentication
            },
        });

        // Check if the response is not successful (status code outside the 200-299 range)
        if (!response.ok) {
            throw new Error('Failed to update user profile'); // Throw an error if the profile update fails
        }

        // Parse the response body as JSON to get the result
        const result = await response.json();
        return result; // Return the response containing updated user information

    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error('Error uploading user profile:', error);

        // Throw the error again to allow calling functions to handle it
        throw error;
    }
};
