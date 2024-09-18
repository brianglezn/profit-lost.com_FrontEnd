export const updateProfile = async (userData: FormData) => {
    try {
        const response = await fetch('https://profit-lost-backend.onrender.com/user/updateProfile', {
            method: 'POST',
            body: userData,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to update user profile');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error uploading user profile:", error);
        throw error;
    }
};
