export const addCategory = async (token: string, name: string, color: string) => {
    try {
        // Send a POST request to add a new category to the server
        const response = await fetch('https://written-ashia-profit-lost-6f7f84ee.koyeb.app/api/categories/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Attach authorization token to authenticate the request
                'Content-Type': 'application/json', // Indicate that the request body is in JSON format
            },
            body: JSON.stringify({ name, color }), // The request body containing the new category's name and color
        });

        // If the response is not OK (status code outside the range 200-299), throw an error
        if (!response.ok) {
            throw new Error('Failed to add category');
        }

        // Parse and return the JSON response containing the new category data
        const newCategory = await response.json();
        return newCategory;
    } catch (error) {
        // Log the error to the console for debugging
        console.error('Error adding category:', error);
        // Re-throw a new error indicating the category addition failed
        throw new Error('Failed to add category');
    }
};
