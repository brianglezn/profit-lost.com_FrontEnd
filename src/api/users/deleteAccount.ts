export const deleteAccount = async (token: string) => {
    try {
        const response = await fetch('https://app-profit-lost-com.onrender.com/user/deleteAccount', {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
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