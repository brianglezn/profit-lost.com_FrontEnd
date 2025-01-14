export async function requestPasswordReset(email: string): Promise<boolean> {
    try {
        const response = await fetch('https://written-ashia-profit-lost-6f7f84ee.koyeb.app/api/auth/requestPasswordReset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        return response.ok;
    } catch (error) {
        console.error('Error sending reset password link:', error);
        return false;
    }
}
