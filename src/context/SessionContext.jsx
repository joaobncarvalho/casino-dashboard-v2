import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  // TanStack Query: Gere cache e loading automaticamente
  const { data: activeSession, isLoading, refetch } = useQuery({
    queryKey: ['active-session'],
    queryFn: () => api.get('/sessions/active'),
    retry: 1, // Tenta reconectar 1 vez se falhar
    staleTime: 30000, // Os dados da sessão são considerados "frescos" por 30 segundos
  });

  return (
    <SessionContext.Provider value={{ activeSession, isLoading, refreshSession: refetch }}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook customizado para facilitar o uso
export const useSession = () => useContext(SessionContext);