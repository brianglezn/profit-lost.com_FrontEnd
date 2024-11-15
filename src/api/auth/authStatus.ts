export async function checkAuthStatus() {
    try {
        const response = await fetch('https://backend-profit-lost-com.onrender.com/auth-status', {
            credentials: 'include',
        });
        if (!response.ok) {
            console.error(`Error en auth-status: ${response.status}`);
            return { isAuthenticated: false };
        }
        const data = await response.json();
        return { isAuthenticated: data.authenticated };
    } catch (error) {
        console.error('Error al verificar el estado de autenticación:', error);
        return { isAuthenticated: false };
    }
}
