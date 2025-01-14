export const editCategory = async (token: string, categoryId: string, name: string, color: string) => {
    try {
        // Send a PUT request to edit an existing category by its ID
        const response = await fetch(`https://written-ashia-profit-lost-6f7f84ee.koyeb.app/api/categories/edit/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`, // Attach authorization token for request authentication
                'Content-Type': 'application/json', // Set content type as JSON
            },
            body: JSON.stringify({ name, color }), // Request body containing updated name and color of the category
        });

        // If the response status is not OK (e.g., 404, 500), throw an error
        if (!response.ok) {
            throw new Error('Failed to edit category');
        }

        // Return a success message upon successful editing of the category
        return 'Category edited successfully';
    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error('Error editing category:', error);
        // Re-throw an error with a message indicating failure to edit the category
        throw new Error('Failed to edit category');
    }
};
