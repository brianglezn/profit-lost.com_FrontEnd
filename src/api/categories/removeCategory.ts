export const removeCategory = async (token: string, categoryId: string) => {
    try {
        // Send a DELETE request to remove the specified category by its ID
        const response = await fetch(`https://written-ashia-profit-lost-6f7f84ee.koyeb.app/api/categories/remove/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // Attach authorization token for authentication
            }
        });

        // Check if the response status is not OK, and throw an error if it fails
        if (!response.ok) {
            throw new Error('Failed to remove category'); // Throw an error if the removal fails
        }

        // Return true if the category is successfully removed
        return true;
    } catch (error) {
        // Log any error to the console for debugging purposes
        console.error('Error removing category:', error);
        // Throw a new error indicating failure to remove the category
        throw new Error('Failed to remove category');
    }
};
