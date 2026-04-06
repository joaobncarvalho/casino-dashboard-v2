import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';
import { Play, Square, Wallet, Loader2 } from 'lucide-react';
import styles from './SessionManager.module.css';

export default function SessionManager() {
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState("");
  const [initialBalance, setInitialBalance] = useState("");

  // 🛑 TRAVA SNIPER: Busca a sessão de forma segura, ignorando o Contexto avariado
  const { data: activeSession, isLoading: isChecking } = useQuery({
    queryKey: ['active-session'],
    queryFn: async () => {
      const res = await api.get('/sessions/active');
      // Se não houver conteúdo (204) ou vier vazio, forçamos null!
      if (res.status === 204 || !res.data || Object.keys(res.data).length === 0) {
        return null;
      }
      return res.data;
    }
  });

  const startMutation = useMutation({
    mutationFn: (data) => api.post('/sessions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-session'] });
      setTitle("");
      setInitialBalance("");
    }
  });

  const stopMutation = useMutation({
    mutationFn: (finalData) => api.put('/sessions/active/end', finalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-session'] });
      queryClient.invalidateQueries({ queryKey: ['live-stats'] });
      queryClient.invalidateQueries({ queryKey: ['session-history'] }); // Atualiza o histórico
    }
  });

  if (isChecking) return <div className={styles.setupCard}><Loader2 className={styles.spin} /></div>;

  // Se o activeSession for REALMENTE verdadeiro, mostra o painel LIVE
  if (activeSession) {
    return (
      <div className={styles.activeContainer}>
        <div className={styles.sessionInfo}>
          <span className={styles.liveBadge}>🔴 LIVE</span>
          <span className={styles.sessionTitle}>{activeSession.title}</span>
        </div>
        
        <div className={styles.balanceInfo}>
          <Wallet size={16} className={styles.iconBlue} />
          <span>${(activeSession.currentBalance ?? 0).toFixed(2)}</span>
        </div>

        <button 
          onClick={() => { 
            if(window.confirm("Encerrar a stream e salvar PnL?")) {
              stopMutation.mutate({ currentBalance: activeSession.currentBalance });
            }
          }} 
          className={styles.stopBtn}
          disabled={stopMutation.isPending}
        >
          {stopMutation.isPending ? <Loader2 className={styles.spin} /> : <Square size={14} />}
          Encerrar
        </button>
      </div>
    );
  }

  // Estado: Sem Sessão
  return (
    <div className={styles.setupCard}>
      <h3 className={styles.setupTitle}>Configuração de Elite v2.0</h3>
      <div className={styles.inputGroup}>
        <label>Nome da Sessão</label>
        <input 
          placeholder="Ex: Noite de Slots #42" 
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Saldo Inicial ($)</label>
        <input 
          type="number" 
          placeholder="0.00" 
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)} 
        />
      </div>
      <button 
        className={styles.startBtn}
        onClick={() => startMutation.mutate({ title, initialBalance: parseFloat(initialBalance) || 0 })}
        disabled={startMutation.isPending || !title}
      >
        {startMutation.isPending ? <Loader2 className={styles.spin} /> : <Play size={16} />}
        Iniciar Motor v2.0
      </button>
    </div>
  );
}