export async function login(identifier: string, password: string): Promise<{ token?: string; error?: string }> {
    try {
        const response = await fetch('https://written-ashia-profit-lost-6f7f84ee.koyeb.app/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identifier, password }),
        });

        const data = await response.json();
        if (response.ok) {
            return { token: data.token };
        } else {
            return { error: data.message || 'Login failed' };
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return { error: 'An error occurred. Please try again later.' };
    }
}
