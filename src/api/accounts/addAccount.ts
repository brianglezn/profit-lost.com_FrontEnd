export async function addAccount(accountName: string): Promise<void> {
    // Define the range of years for which records will be created (last 2 years and the current year)
    const startYear = new Date().getFullYear() - 2;
    const endYear = new Date().getFullYear();
    const records = [];

    // Loop through each year and month to create records with an initial value of 0
    for (let year = startYear; year <= endYear; year++) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (const month of months) {
            records.push({ year, month, value: 0 });
        }
    }

    const configuration = {
        backgroundColor: '#7e2a10',
        color: '#ffffff',
    };

    try {
        // Send a POST request to add the new account with cookies included
        const response = await fetch('https://backend-profit-lost-com.onrender.com/accounts/add', {
            method: 'POST',
            credentials: 'include', // Include cookies for authentication
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accountName,
                records,
                configuration,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error adding account:', error);
        throw error;
    }
}
