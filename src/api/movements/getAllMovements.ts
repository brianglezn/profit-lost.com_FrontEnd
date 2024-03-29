export const getAllMovements = async (token: string) => {
    try {
        const response = await fetch('https://profit-lost-backend.onrender.com/movements/all', {
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
        console.error('There was an error fetching the movements:', error);
        throw new Error('Failed to fetch movements');
    }
};
