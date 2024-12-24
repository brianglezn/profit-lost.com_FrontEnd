export async function resetPassword(token: string, newPassword: string): Promise<{ success?: boolean; error?: string }> {
    try {
        const response = await fetch('https://sound-harlene-brian-novoa-be9c1292.koyeb.app/api/auth/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true };
        } else {
            return { error: data.error || 'Failed to reset password' };
        }
    } catch (error) {
        console.error('Error during password reset:', error);
        return { error: 'An error occurred. Please try again later.' };
    }
}
