import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';

export function useActiveHunt() {
  const queryClient = useQueryClient();

  // Busca a hunt mais recente da sessão
  const { data: hunt, isLoading } = useQuery({
    queryKey: ['active-hunt'],
    queryFn: () => api.get('/bonus-hunt/latest'), // Precisas deste endpoint na API
    retry: false
  });

  // Mutação para adicionar slot à hunt
  const addSlotMutation = useMutation({
    mutationFn: ({ huntId, slot }) => api.put(`/bonus-hunt/${huntId}/slots`, slot),
    onSuccess: () => queryClient.invalidateQueries(['active-hunt'])
  });

  // Mutação para registar prémio (PATCH v2.0)
  const collectMutation = useMutation({
    mutationFn: ({ huntId, slotName, amount }) => 
      api.patch(`/bonus-hunt/${huntId}/slots/${slotName}/collect?amount=${amount}`),
    onSuccess: () => {
        queryClient.invalidateQueries(['active-hunt']);
        queryClient.invalidateQueries(['live-stats']); // Atualiza o saldo global!
    }
  });

  return { hunt, isLoading, addSlot: addSlotMutation.mutate, collectWin: collectMutation.mutate };
}