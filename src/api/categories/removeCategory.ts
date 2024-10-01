export const removeCategory = async (token: string, categoryId: string) => {
    try {
        const response = await fetch(`https://app-profit-lost-com.onrender.com/categories/remove/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to remove category');
        }

        return true;
    } catch (error) {
        console.error('Error removing category:', error);
        throw new Error('Failed to remove category');
    }
};
