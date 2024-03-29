export const editCategory = async (token: string, categoryId: string, name: string) => {
    try {
        const response = await fetch(`https://profit-lost-backend.onrender.com/categories/edit/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
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
