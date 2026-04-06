import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';

export function useCreateHunt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      let sessionId = null;

      try {
        const sessionRes = await api.get('/sessions/active');
        if (sessionRes.status === 204 || !sessionRes.data) {
          throw new Error("Sem sessão"); 
        }
        sessionId = sessionRes.data.id || sessionRes.data._id;
      } catch (error) {
        throw new Error("Tens de ir ao separador 'Dashboard' e Iniciar a Sessão (Live) primeiro!");
      }

      if (!sessionId) {
        throw new Error("Erro ao identificar a sessão. Inicia uma nova no Dashboard.");
      }

      // 1. Manda criar a Hunt no Backend
      await api.post('/bonus-hunt', {
        ...data,
        sessionId: sessionId
      });
      
      // (Já não precisamos de extrair o response.data aqui)
      return true; 
    },
    onSuccess: async () => {
      // 2. A MAGIA SEGURA: Obrigamos o React Query a ir à rota GET /latest 
      // buscar a Hunt verdadeira e construída pelo Java. 
      // O 'await' faz com que o botão continue a rodar até a tabela estar pronta a aparecer!
      await queryClient.refetchQueries({ queryKey: ['active-hunt'], exact: true });
      
      queryClient.invalidateQueries({ queryKey: ['live-stats'] });
    },
    onError: (error) => {
      console.error(error);
    }
  });
}