export const editMovement = async (token: string, movementId: string, movementData: {
    date: string,
    description: string,
    amount: number,
    category: string
}) => {
    try {
        const response = await fetch(`https://profit-lost-backend.onrender.com/movements/edit/${movementId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movementData),
        });

        if (!response.ok) {
            throw new Error('Failed to edit movement');
        }

        const updatedMovement = await response.json();
        return updatedMovement;
    } catch (error) {
        console.error('Error editing movement:', error);
        throw new Error('Failed to edit movement');
    }
};