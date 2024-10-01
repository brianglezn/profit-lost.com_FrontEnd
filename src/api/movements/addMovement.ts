export const addMovement = async (token: string, movementData: {
    date: string,
    description: string,
    amount: number,
    category: string
}) => {
    try {
        const response = await fetch('https://app-profit-lost-com.onrender.com/movements/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movementData),
        });

        if (!response.ok) {
            throw new Error('Failed to add movement');
        }

        const newMovement = await response.json();
        return newMovement;
    } catch (error) {
        console.error('Error adding new movement:', error);
        throw new Error('Failed to add movement');
    }
};