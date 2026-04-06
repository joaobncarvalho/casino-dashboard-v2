import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';

export function useCreateSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSlot) => api.post('/slots', newSlot),
    onSuccess: () => {
      // Invalida a lista de slots para atualizar o catálogo automaticamente
      queryClient.invalidateQueries(['slots-catalog']);
    }
  });
}