export const getUserByToken = async () => {
    try {
        const response = await fetch('https://backend-profit-lost-com.onrender.com/user/me', {
            method: 'GET',
            credentials: 'include', // Incluir cookies para autenticación
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user information');
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error fetching user information:', error);
        throw new Error('Failed to fetch user information');
    }
};
