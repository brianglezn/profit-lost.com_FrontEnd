export async function checkAuthStatus() {
    try {
        const response = await fetch('https://backend-profit-lost-com.onrender.com/auth-status', {
            credentials: 'include',  // Incluir cookies en las solicitudes
        });
        if (!response.ok) {
            return { isAuthenticated: false };  // Si la respuesta no es 200 OK, no está autenticado
        }
        const data = await response.json();
        return { isAuthenticated: data.authenticated };
    } catch (error) {
        console.error('Error checking authentication status:', error);
        return { isAuthenticated: false };
    }
}
