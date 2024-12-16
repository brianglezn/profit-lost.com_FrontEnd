export const getAccountsByYear = async (token: string, year: string) => {
    try {
        // Send a GET request to fetch accounts data for the specified year
        const response = await fetch(`https://sound-harlene-brian-novoa-be9c1292.koyeb.app/accounts/${year}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the authorization token in the request header
            },
        });

        // Check if the response status is not OK (e.g., 200 OK). If it's not, throw an error
        if (!response.ok) {
            throw new Error('Failed to fetch accounts for year ' + year); // Provide an error message specific to the year
        }

        // Parse the response JSON and return the list of accounts
        const accounts = await response.json();
        return accounts;
    } catch (error) {
        // Log the error to the console and throw a new error with a detailed message
        console.error('Error fetching accounts for year ' + year + ':', error);
        throw new Error('Failed to fetch accounts for year ' + year);
    }
};
