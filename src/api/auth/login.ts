export async function login(identifier: string, password: string): Promise<{ token?: string; error?: string }> {
    try {
        const response = await fetch('https://sound-harlene-brian-novoa-be9c1292.koyeb.app/login', {
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
