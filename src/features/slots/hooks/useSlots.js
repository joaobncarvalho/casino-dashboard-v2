import { useQuery } from '@tanstack/react-query';
import api from '../../../api/client';

export function useSlots() {
  return useQuery({
    queryKey: ['slots-catalog'],
    queryFn: async () => {
      // 1. Fazemos o pedido à API
      const response = await api.get('/slots');
      
      return response.data; 
    }
  });
}