export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    // Send a POST request to the server to change the user's password
    const response = await fetch('https://sound-harlene-brian-novoa-be9c1292.koyeb.app/api/user/changePassword', {
      method: 'POST', // Using POST method as we're making a data change on the server
      headers: {
        'Content-Type': 'application/json', // Specifies that the content type is JSON
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Includes the authorization token for authentication
      },
      body: JSON.stringify({
        currentPassword, // Include the current password in the request body
        newPassword, // Include the new password in the request body
      }),
    });

    // If the response is not OK, throw an error indicating that the password change failed
    if (!response.ok) {
      throw new Error('Failed to change password');
    }

    // Parse the response data as JSON and return it
    const data = await response.json();
    return data;
  } catch (error) {
    // If an error occurs, create an error message and throw it
    const errorMessage =
      error instanceof Error ? error.message : 'Error changing password'; // Ensure that the error has a readable message
    throw new Error(errorMessage);
  }
};
