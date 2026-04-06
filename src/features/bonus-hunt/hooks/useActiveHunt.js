import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';

export function useActiveHunt() {
  const queryClient = useQueryClient();

  const { data: hunt, isLoading } = useQuery({
    queryKey: ['active-hunt'],
    queryFn: () => api.get('/bonus-hunt/latest'),
    retry: false
  });

  const addSlotMutation = useMutation({
    mutationFn: ({ huntId, slot }) => api.put(`/bonus-hunt/${huntId}/slots`, slot),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['active-hunt'] })
  });

  const collectMutation = useMutation({
    mutationFn: ({ huntId, slotName, amount }) => 
      api.patch(`/bonus-hunt/${huntId}/slots/${slotName}/collect?amount=${amount}`),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['active-hunt'] });
        queryClient.invalidateQueries({ queryKey: ['live-stats'] });
    }
  });

  return { hunt, isLoading, addSlot: addSlotMutation.mutate, collectWin: collectMutation.mutate };
}