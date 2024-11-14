export const deleteProfileImage = async () => {
    try {
        const response = await fetch('https://backend-profit-lost-com.onrender.com/user/deleteProfileImage', {
            method: 'POST',
            credentials: 'include', // Incluir cookies para autenticación
        });

        if (!response.ok) {
            throw new Error('Failed to delete profile image');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error deleting profile image';
        throw new Error(errorMessage);
    }
};
