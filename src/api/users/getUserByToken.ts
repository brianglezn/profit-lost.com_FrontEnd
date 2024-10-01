export const getUserByToken = async (token: string) => {
    try {
        const response = await fetch('https://app-profit-lost-com.onrender.com/user/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
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
