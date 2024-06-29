export const addCategory = async (token: string, name: string, color: string) => {
    try {
        const response = await fetch('https://profit-lost-backend.onrender.com/categories/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, color }),
        });

        if (!response.ok) {
            throw new Error('Failed to add category');
        }

        const newCategory = await response.json();
        return newCategory;
    } catch (error) {
        console.error('Error adding category:', error);
        throw new Error('Failed to add category');
    }
};