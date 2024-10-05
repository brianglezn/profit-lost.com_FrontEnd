export async function addAccount(accountName: string): Promise<void> {
    // Retrieve the authentication token from local storage
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.'); // Throw an error if no token is found
    }

    // Define the range of years for which records will be created (last 2 years and the current year)
    const startYear = new Date().getFullYear() - 2;
    const endYear = new Date().getFullYear();
    const records = [];

    // Loop through each year and month to create records with an initial value of 0
    for (let year = startYear; year <= endYear; year++) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (const month of months) {
            records.push({ year, month, value: 0 }); // Add record for each month
        }
    }

    // Define the default configuration for the account's appearance
    const configuration = {
        backgroundColor: "#7e2a10", // Default background color for the account
        color: "#ffffff" // Default text color for the account
    };

    try {
        // Send a POST request to the server to add the new account
        const response = await fetch('https://app-profit-lost-com.onrender.com/accounts/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the authorization token in the request header
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accountName,
                records, // Send the created records for the account
                configuration, // Send the configuration details for the account
            }),
        });

        // If the response is not OK, throw an error with the response status or text
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        // Log the error to the console and throw it again to be handled by the calling function
        console.error('Error adding account:', error);
        throw error;
    }
}
