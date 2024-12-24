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
  console.log('🔄 UserProvider Renderizado');
  const [user, setUser] = useState<User | null>(null);
  const [currency, setCurrency] = useState<string>('USD');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { t } = useTranslation();

  const fetchUserData = useCallback(async () => {
    console.log('📡 Iniciando fetchUserData');
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token:', token ? 'Presente' : 'Ausente');
      
      if (!token) {
        setUser(null);
        setError('No token found');
        setLoading(false);
        return;
      }

      const userData = await getUserByToken(token);
      console.log('👤 Usuario obtenido:', userData.email);
      
      setUser(userData);
      setCurrency(userData.currency || 'USD');
      setError(null);
    } catch (err) {
      console.error('❌ Error en fetchUserData:', err);
      setError(err instanceof Error ? err.message : 'Error fetching user data');
      setUser(null);
    } finally {
      console.log('✅ fetchUserData completado');
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    console.log('🔄 Iniciando refreshUser');
    setLoading(true);
    try {
      await fetchUserData();
    } catch (err) {
      console.error('❌ Error en refreshUser:', err);
      toast.error(t('dashboard.common.error_user_fetch'));
    }
  };

  useEffect(() => {
    console.log('🎬 UserProvider useEffect inicial');
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