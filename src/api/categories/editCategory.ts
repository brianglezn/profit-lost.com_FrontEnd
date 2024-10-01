export const editCategory = async (token: string, categoryId: string, name: string, color: string) => {
    try {
        const response = await fetch(`https://app-profit-lost-com.onrender.com/categories/edit/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, color }),
        });

        if (!response.ok) {
            throw new Error('Failed to edit category');
        }

        return 'Category edited successfully';
    } catch (error) {
        console.error('Error editing category:', error);
        throw new Error('Failed to edit category');
    }
};