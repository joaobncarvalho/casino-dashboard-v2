import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';
import { useSession } from '../../../context/SessionContext';

export function useCreateHunt() {
  const queryClient = useQueryClient();
  const { activeSession } = useSession();

  return useMutation({
    mutationFn: (data) => api.post('/bonus-hunt', {
      ...data,
      sessionId: activeSession.id // Vínculo obrigatório v2.0
    }),
    onSuccess: () => {
      // Forçamos o refresh da hunt ativa para a tabela aparecer
      queryClient.invalidateQueries(['active-hunt']);
      queryClient.invalidateQueries(['live-stats']);
    }
  });
}