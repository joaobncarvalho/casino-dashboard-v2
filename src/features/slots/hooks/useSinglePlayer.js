import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';
import { useSession } from '../../../context/SessionContext';

export function useSinglePlayer(slotName) {
  const queryClient = useQueryClient();
  const { activeSession } = useSession();

  // 1. Busca estatísticas em tempo real para a slot selecionada
  const statsQuery = useQuery({
    queryKey: ['slot-stats', slotName],
    queryFn: () => api.get(`/slot-stats/${slotName}/statistics`),
    enabled: !!slotName, // Só corre se houver uma slot selecionada
    refetchInterval: 10000,
  });

  // 2. Mutação para salvar nova jogada
  const saveMutation = useMutation({
    mutationFn: (gameData) => api.post('/single-player', {
      ...gameData,
      sessionId: activeSession?.id
    }),
    onSuccess: () => {
      // Atualiza as stats da slot e o PnL global da live
      queryClient.invalidateQueries({ queryKey: ['slot-stats', slotName] });
      queryClient.invalidateQueries({ queryKey: ['live-stats'] });
    }
  });

  // 3. Mutação para atualizar o Widget do OBS
  const updateWidget = useMutation({
    mutationFn: (name) => api.post(`/widget/slot`, name),
  });

  return { 
    stats: statsQuery.data, 
    isLoadingStats: statsQuery.isLoading,
    saveGame: saveMutation.mutate,
    isSaving: saveMutation.isPending,
    updateWidget: updateWidget.mutate
  };
}