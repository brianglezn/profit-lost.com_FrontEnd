export const getAllCategories = async () => {
    try {
        // Send a GET request to fetch all categories with credentials included
        const response = await fetch('https://backend-profit-lost-com.onrender.com/categories/all', {
            method: 'GET',
            credentials: 'include', // Include cookies for authentication
        });

        // Check if the response is successful (status code is OK)
        if (!response.ok) {
            throw new Error('Failed to fetch categories'); // Throw an error if response status is not OK
        }

        // Parse and return the categories as JSON data
        const categories = await response.json();
        return categories;
    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error('Error fetching categories:', error);
        // Re-throw an error with a message indicating failure to fetch categories
        throw new Error('Failed to fetch categories');
    }
};
