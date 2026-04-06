import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';

export function useActiveHunt() {
  const queryClient = useQueryClient();

  const { data: hunt, isLoading } = useQuery({
    queryKey: ['active-hunt'],
    queryFn: () => api.get('/bonus-hunt/latest').then(res => res.data),
  });

  // Mutação para atualizar apenas a aposta
  const updateBetMutation = useMutation({
    mutationFn: ({ huntId, slotName, bet }) => 
      api.patch(`/bonus-hunt/${huntId}/slots/${slotName}/bet`, { bet }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['active-hunt'] })
  });

  const addSlotMutation = useMutation({
    mutationFn: ({ huntId, slotData }) => api.put(`/bonus-hunt/${huntId}/slots`, slotData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['active-hunt'] })
  });

  return {
    hunt,
    addSlot: (slot) => {
      const id = hunt?.id || hunt?._id;
      if (!id || hunt.status !== 'OPEN') return;
      
      addSlotMutation.mutate({ 
        huntId: id, 
        slotData: {
          name: slot.name,
          bet: 0.20, // Valor padrão inicial
          imageUrl: slot.imageUrl,
          win: 0,
          collected: false
        } 
      });
    },
    updateBet: (slotName, bet) => {
      const id = hunt?.id || hunt?._id;
      if (id) updateBetMutation.mutate({ huntId: id, slotName, bet });
    }
  };
}