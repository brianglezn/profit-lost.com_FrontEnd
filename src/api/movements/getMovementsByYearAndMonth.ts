export const getMovementsByYearAndMonth = async (token: string, year: string, month: string) => {
    try {
        const response = await fetch(`https://profit-lost-backend.onrender.com/movements/${year}/${month}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const movements = await response.json();
        return movements;
    } catch (error) {
        console.error('There was an error fetching the movements for the specified year and month:', error);
        throw new Error('Failed to fetch movements for the specified year and month');
    }
};