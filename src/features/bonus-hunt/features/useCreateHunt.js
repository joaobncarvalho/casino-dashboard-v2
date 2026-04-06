import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';
import { useSession } from '../../../context/SessionContext';

export function useCreateHunt() {
  const queryClient = useQueryClient();
  const { activeSession } = useSession();

  return useMutation({
    mutationFn: (data) => api.post('/bonus-hunt', {
      ...data,
      sessionId: activeSession?.id // 🛑 Previne undefined crash
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-hunt'] });
      queryClient.invalidateQueries({ queryKey: ['live-stats'] });
    }
  });
}