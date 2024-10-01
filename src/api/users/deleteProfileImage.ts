export const deleteProfileImage = async () => {
    try {
        const response = await fetch('https://app-profit-lost-com.onrender.com/user/deleteProfileImage', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete profile image');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Error deleting profile image';
        throw new Error(errorMessage);
    }
};
