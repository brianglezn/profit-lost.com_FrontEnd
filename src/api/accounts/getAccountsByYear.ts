export const getAccountsByYear = async (token: string, year: string) => {
    try {
        const response = await fetch(`https://profit-lost-backend.onrender.com/accounts/${year}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch accounts for year ' + year);
        }

        const accounts = await response.json();
        return accounts;
    } catch (error) {
        console.error('Error fetching accounts for year ' + year + ':', error);
        throw new Error('Failed to fetch accounts for year ' + year);
    }
};
