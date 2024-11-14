export async function login(identifier: string, password: string): Promise<{ success?: boolean; error?: string }> {
    try {
        const response = await fetch('https://backend-profit-lost-com.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identifier, password }),
            credentials: 'include',  // Permite el manejo de cookies en la solicitud
        });

        if (response.ok) {
            return { success: true };
        } else {
            const data = await response.json();
            return { error: data.message || 'Login failed' };
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return { error: 'An error occurred. Please try again later.' };
    }
}
