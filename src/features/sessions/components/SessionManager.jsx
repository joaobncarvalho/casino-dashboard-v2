import { useState } from 'react';
import { useSession } from '../../../context/SessionContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/client';
import { Play, Square, Wallet, Loader2 } from 'lucide-react';
import styles from './SessionManager.module.css';

export default function SessionManager() {
  const { activeSession, refreshSession } = useSession();
  const queryClient = useQueryClient();
  
  // Estados locais para o formulário
  const [title, setTitle] = useState("");
  const [initialBalance, setInitialBalance] = useState("");

  // Mutação: Iniciar Sessão
  const startMutation = useMutation({
    mutationFn: (data) => api.post('/sessions', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['active-session']);
      refreshSession();
      setTitle("");
      setInitialBalance("");
    }
  });

  // Mutação: Encerrar Sessão
  const stopMutation = useMutation({
    mutationFn: () => api.put('/sessions/active/end'),
    onSuccess: () => {
      queryClient.invalidateQueries(['active-session']);
      queryClient.setQueryData(['active-session'], null);
      refreshSession();
    }
  });

  // Estado: Sessão Ativa
  if (activeSession) {
    return (
      <div className={styles.activeContainer}>
        <div className={styles.sessionInfo}>
          <span className={styles.liveBadge}>🔴 LIVE</span>
          <span className={styles.sessionTitle}>{activeSession.title}</span>
        </div>
        
        <div className={styles.balanceInfo}>
          <Wallet size={16} className={styles.iconBlue} />
          <span>${activeSession.currentBalance?.toFixed(2)}</span>
        </div>

        <button 
          onClick={() => { if(window.confirm("Encerrar a stream e salvar PnL?")) stopMutation.mutate() }} 
          className={styles.stopBtn}
          disabled={stopMutation.isPending}
        >
          {stopMutation.isPending ? <Loader2 className={styles.spin} /> : <Square size={14} />}
          Encerrar
        </button>
      </div>
    );
  }

  // Estado: Sem Sessão (Setup)
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