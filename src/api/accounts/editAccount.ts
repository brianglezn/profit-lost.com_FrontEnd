interface AccountRecord {
    year: number;
    month: string;
    value: number;
}

interface AccountConfiguration {
    backgroundColor: string;
    color: string;
}

interface EditAccountParams {
    accountId: string;
    accountName?: string;
    records?: AccountRecord[];
    configuration?: AccountConfiguration;
}

export async function editAccount({ accountId, accountName, records, configuration }: EditAccountParams): Promise<void> {
    // Retrieve the authentication token from local storage
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.'); // Throw an error if no token is found
    }

    // Construct the update data object dynamically, only including provided fields
    const updateData = {
        ...(accountName && { accountName }), // Include account name if provided
        ...(records && { records }), // Include records if provided
        ...(configuration && { configuration }), // Include configuration if provided
    };

    try {
        // Send a PUT request to the server to edit the existing account
        const response = await fetch(`https://app-profit-lost-com.onrender.com/accounts/edit/${accountId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the authorization token in the request header
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData), // Send only the fields that need to be updated
        });

        // If the response is not OK, throw an error with the response status or text
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        // Log the error to the console and throw it again to be handled by the calling function
        console.error('Error editing account:', error);
        throw error;
    }
}
