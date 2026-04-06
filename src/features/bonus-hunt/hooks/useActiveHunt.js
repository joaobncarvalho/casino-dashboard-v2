import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';

export function useActiveHunt() {
  const queryClient = useQueryClient();

  // 1. Buscar Hunt Ativa
  const { data: hunt, isLoading } = useQuery({
    queryKey: ['active-hunt'],
    queryFn: async () => {
      const res = await api.get('/bonus-hunt/latest');
      if (res.status === 204 || !res.data) return null;
      return res.data;
    }
  });

  // 2. Mutação: Adicionar Slot
  const addSlotMutation = useMutation({
    mutationFn: ({ huntId, slotData }) => api.put(`/bonus-hunt/${huntId}/slots`, slotData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['active-hunt'] })
  });

  // --- ADICIONA ESTA MUTAÇÃO AO TEU HOOK ---
  const finishHuntMutation = useMutation({
    mutationFn: (huntId) => api.put(`/bonus-hunt/${huntId}/finish`),
    onSuccess: () => {
      // Invalida para que o componente volte ao estado inicial (BonusHuntForm)
      queryClient.invalidateQueries({ queryKey: ['active-hunt'] });
      queryClient.invalidateQueries({ queryKey: ['live-stats'] });
    }
  });

  return {
    // ... tudo o que já tinhas ...
    finishHunt: () => {
      const id = hunt?.id || hunt?._id;
      if (id) finishHuntMutation.mutate(id);
    },
    isFinishing: finishHuntMutation.isPending
  };

  // 3. Mutação: Atualizar Aposta na Tabela
  const updateBetMutation = useMutation({
    mutationFn: ({ huntId, slotName, bet }) => 
      api.patch(`/bonus-hunt/${huntId}/slots/${slotName}/bet`, { bet }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['active-hunt'] })
  });

  // 4. Mutação: Iniciar Abertura (O Gatilho!)
  const startOpeningMutation = useMutation({
    mutationFn: (huntId) => api.put(`/bonus-hunt/${huntId}/start-collection`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['active-hunt'] })
  });

  // 5. Mutação: Coletar Prémio (Quando o Streamer digita o resultado)
  const collectWinMutation = useMutation({
    // Adapta a rota abaixo se o teu Java estiver à espera de um formato diferente
    mutationFn: ({ huntId, slotName, amount }) => 
      api.put(`/bonus-hunt/${huntId}/slots/${slotName}/collect`, { winAmount: amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-hunt'] });
      queryClient.invalidateQueries({ queryKey: ['live-stats'] }); // Atualiza os lucros no Dashboard
    }
  });

  // 🚀 O RETORNO: Tudo o que as tuas páginas podem usar
  return {
    hunt,
    isLoading,
    
    // Método: Adicionar nova slot do Modal
    addSlot: (slotData) => {
      const id = hunt?.id || hunt?._id;
      if (!id || hunt.status !== 'OPEN') return;
      
      addSlotMutation.mutate({ 
        huntId: id, 
        slotData: {
          name: slotData.name,
          bet: slotData.bet,
          superMode: slotData.superMode || false,
          imageUrl: slotData.imageUrl,
          win: 0,
          collected: false
        } 
      });
    },

    // Método: Alterar aposta inline na tabela
    updateBet: (slotName, bet) => {
      const id = hunt?.id || hunt?._id;
      if (id) updateBetMutation.mutate({ huntId: id, slotName, bet });
    },

    // Método: Trancar a lista e começar a abrir!
    startOpening: () => {
      const id = hunt?.id || hunt?._id;
      if (id) startOpeningMutation.mutate(id);
    },

    // Método: Salvar o valor ganho na slot
    collectWin: ({ huntId, slotName, amount }) => {
      collectWinMutation.mutate({ huntId, slotName, amount });
    },

    // Estados de loading para UI
    isStarting: startOpeningMutation.isPending
  };
}