export const getMovementsByYearAndMonth = async (token: string, year: string, month: string) => {
    try {
        const response = await fetch(`https://written-ashia-profit-lost-6f7f84ee.koyeb.app/api/movements/${year}/${month}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const movements = await response.json();
        return movements;
    } catch (error) {
        console.error('Error fetching movements by year and month:', error);
        throw new Error('Failed to fetch movements for the specified year and month');
    }
};
