import { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { getUserByToken } from '../api/users/getUserByToken';
import { User } from '../helpers/types';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface UserContextType {
  user: User | null;
  currency: string;
  language: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY';
  timeFormat: '12h' | '24h';
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    user: null as User | null,
    currency: 'USD',
    language: 'en',
    dateFormat: 'MM/DD/YYYY' as const,
    timeFormat: '12h' as const,
    loading: true,
    error: null as string | null
  });
  
  const { t } = useTranslation();

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setState(prev => ({
        ...prev,
        user: null,
        error: 'No token found',
        loading: false
      }));
      return;
    }

    try {
      const userData = await getUserByToken(token);
      setState(prev => ({
        ...prev,
        user: userData,
        error: null,
        loading: false
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        user: null,
        error: err instanceof Error ? err.message : 'Error fetching user data',
        loading: false
      }));
    }
  }, []);

  const contextValue = useMemo(() => ({
    ...state,
    refreshUser: async () => {
      setState(prev => ({ ...prev, loading: true }));
      try {
        await fetchUserData();
      } catch {
        toast.error(t('dashboard.common.error_user_fetch'));
        setState(prev => ({ ...prev, loading: false }));
      }
    }
  }), [state, fetchUserData, t]);

  useEffect(() => {
    fetchUserData();
  }, []);

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
} 