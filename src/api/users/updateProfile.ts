export const updateProfile = async (userData: FormData) => {
    try {
        const response = await fetch('https://backend-profit-lost-com.onrender.com/user/updateProfile', {
            method: 'POST',
            body: userData,
            credentials: 'include', // Incluir cookies para autenticación
        });

        if (!response.ok) {
            throw new Error('Failed to update user profile');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error uploading user profile:', error);
        throw error;
    }
};
