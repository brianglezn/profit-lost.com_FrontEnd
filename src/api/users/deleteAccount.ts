export const deleteAccount = async () => {
    try {
        const response = await fetch('https://backend-profit-lost-com.onrender.com/user/deleteAccount', {
            method: 'DELETE',
            credentials: 'include', // Incluir cookies para autenticación
        });

        if (!response.ok) {
            throw new Error('Failed to delete account');
        }

        return response;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw new Error('Failed to delete account');
    }
};
