import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export function useUser() {
  console.log('🎯 useUser Hook llamado');
  const context = useContext(UserContext);
  
  if (context === undefined) {
    console.error('❌ useUser debe ser usado dentro de UserProvider');
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
} 