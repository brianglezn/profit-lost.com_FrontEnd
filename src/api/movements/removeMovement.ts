export const removeMovement = async (token: string, movementId: string) => {
    try {
        const response = await fetch(`https://app-profit-lost-com.onrender.com/movements/remove/${movementId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to remove movement');
        }

        return 'Movement removed successfully';
    } catch (error) {
        console.error('Error removing movement:', error);
        throw new Error('Failed to remove movement');
    }
};
