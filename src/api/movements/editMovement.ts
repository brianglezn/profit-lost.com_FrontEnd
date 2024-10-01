export const editMovement = async (token: string, movementId: string, movementData: {
    date: string,
    description: string,
    amount: number,
    category: string
}) => {
    try {
        const response = await fetch(`https://app-profit-lost-com.onrender.com/movements/edit/${movementId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movementData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error text:', errorText);
            throw new Error(errorText || 'Failed to edit movement');
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const updatedMovement = await response.json();
            return updatedMovement;
        } else {
            const textResponse = await response.text();
            return textResponse;
        }
    } catch (error) {
        console.error('Error editing movement:', error);
        throw new Error('Failed to edit movement');
    }
};