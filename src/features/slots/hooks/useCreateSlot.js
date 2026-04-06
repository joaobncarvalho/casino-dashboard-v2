import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';

export function useCreateSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    // Envia diretamente o formData, o backend reconhece como Multipart!
    mutationFn: (formData) => api.post('/slots', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots-catalog'] });
      alert("Slot guardada com sucesso!"); // Alerta visual para teres a certeza
    },
    onError: (error) => {
      console.error("Erro ao guardar na BD:", error);
      alert("Falha ao gravar na BD! Vê a consola.");
    }
  });
}