import { User } from '../../helpers/types';

export async function register(userData: Pick<User, 'username' | 'name' | 'surname' | 'email' | 'password'>): Promise<{ success?: boolean; error?: string }> {
  try {
    const response = await fetch('https://written-ashia-profit-lost-6f7f84ee.koyeb.app/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true };
    } else {
      console.error("Error response data:", data);
      return { error: data.error || 'Registration failed' };
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return { error: 'An error occurred. Please try again later.' };
  }
}
