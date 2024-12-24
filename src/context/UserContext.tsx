import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getUserByToken } from '../api/users/getUserByToken';
import { User } from '../helpers/types';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface UserContextType {
  user: User | null;
  currency: string;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [currency, setCurrency] = useState<string>('USD');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { t } = useTranslation();

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        toast.error(t('landing.auth.common.error_token'));
        setLoading(false);
        return;
      }

      const userData = await getUserByToken(token);
      setUser(userData);
      setCurrency(userData.currency || 'USD');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching user data';
      setError(errorMessage);
      toast.error(t('dashboard.common.error_user_fetch'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const refreshUser = async () => {
    await fetchUserData();
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <UserContext.Provider
      value={{
        user,
        currency,
        loading,
        error,
        refreshUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
} 