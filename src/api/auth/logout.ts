export async function logout(): Promise<{ success: boolean; message?: string }> {
    try {
        const response = await fetch('https://backend-profit-lost-com.onrender.com/logout', {
            method: 'POST',
            credentials: 'include',
        });
        const data = await response.json();
        return { success: response.ok, message: data.message };
    } catch (error) {
        console.error('Error during logout:', error);
        return { success: false, message: 'Error during logout' };
    }
}
