import { useQuery } from '@tanstack/react-query';
import api from '../../../api/client';

export function useSessionHistory() {
  return useQuery({
    queryKey: ['sessions-history'],
    queryFn: () => api.get('/sessions'), // A API v2.0 retorna a lista completa
    select: (data) => data.filter(s => s.status === 'FINISHED' || s.endTime != null)
                          .sort((a, b) => new Date(b.startTime) - new Date(a.startTime)),
  });
}