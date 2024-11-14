export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await fetch('https://backend-profit-lost-com.onrender.com/user/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies para autenticación
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      throw new Error('Failed to change password');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error changing password';
    throw new Error(errorMessage);
  }
};
