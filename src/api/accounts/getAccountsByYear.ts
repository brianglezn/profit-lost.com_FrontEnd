export const getAccountsByYear = async (year: string) => {
    try {
        // Send a GET request to fetch accounts data for the specified year with cookies included
        const response = await fetch(`https://backend-profit-lost-com.onrender.com/accounts/${year}`, {
            method: 'GET',
            credentials: 'include', // Include cookies for authentication
        });

        // Check if the response status is not OK (e.g., 200 OK). If it's not, throw an error
        if (!response.ok) {
            throw new Error('Failed to fetch accounts for year ' + year); // Provide an error message specific to the year
        }

        // Parse the response JSON and return the list of accounts
        const accounts = await response.json();
        return accounts;
    } catch (error) {
        console.error('Error fetching accounts for year ' + year + ':', error);
        throw new Error('Failed to fetch accounts for year ' + year);
    }
};
