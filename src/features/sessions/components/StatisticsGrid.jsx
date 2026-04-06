import { useQuery } from '@tanstack/react-query';
import api from '../../../api/client';
import { TrendingUp, TrendingDown, DollarSign, Activity, Percent, Loader2, PowerOff } from 'lucide-react';
import styles from './StatisticsGrid.module.css';

export default function StatisticsGrid() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['live-stats'],
    queryFn: async () => {
      const res = await api.get('/sessions/active/stats');
      // 🛑 O SEGREDO ESTÁ AQUI: Extraímos res.data e bloqueamos o 204
      if (res.status === 204 || !res.data) return null;
      return res.data;
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer} style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#64748b' }}>
        <Loader2 className={styles.spin} />
        <span>A processar PnL em tempo real...</span>
      </div>
    );
  }

  // Se houver erro crítico na base de dados
  if (error) return <div style={{ color: '#ef4444' }}>Erro crítico ao carregar estatísticas.</div>;

  // ESTADO OFFLINE: Se stats for null (Stream Desligada)
  if (!stats) {
    return (
      <div className={styles.container}>
        <div 
          className={styles.glassCard} 
          style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '4rem 2rem',
            border: '1px dashed #334155' 
          }}
        >
          <PowerOff size={48} color="#64748b" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ color: '#94a3b8', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Dashboard Offline
          </h3>
          <p style={{ color: '#64748b' }}>
            Inicia uma nova sessão para acompanhar as estatísticas em tempo real.
          </p>
        </div>
      </div>
    );
  }

  // ESTADO ONLINE (Temos dados, é seguro extrair a matemática)
  const netPnl = stats.netPnl ?? 0;
  const totalWagered = stats.totalWagered ?? 0;
  const luckFactor = stats.luckFactor ?? 0;
  const isProfit = netPnl >= 0;

  return (
    <div className={styles.container}>
      <div className={`${styles.glassCard} ${isProfit ? styles.borderProfit : styles.borderLoss}`}>
        <div className={styles.cardHeader}>
          <Activity size={18} />
          <span>NET PROFIT & LOSS</span>
        </div>
        <div className={styles.cardBody}>
          <h2 className={isProfit ? styles.textProfit : styles.textLoss}>
            {isProfit ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
            ${Math.abs(netPnl).toFixed(2)}
          </h2>
          <p className={styles.subtext}>Lucro líquido da sessão atual</p>
        </div>
      </div>

      <div className={styles.glassCard}>
        <div className={styles.cardHeader}>
          <DollarSign size={18} className={styles.iconBlue} />
          <span>TOTAL WAGERED</span>
        </div>
        <div className={styles.cardBody}>
          <h2>${totalWagered.toFixed(2)}</h2>
          <p className={styles.subtext}>Volume total apostado</p>
        </div>
      </div>

      <div className={styles.glassCard}>
        <div className={styles.cardHeader}>
          <Percent size={18} className={styles.iconPurple} />
          <span>LUCK FACTOR</span>
        </div>
        <div className={styles.cardBody}>
          <h2>{luckFactor.toFixed(1)}%</h2>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${Math.min(luckFactor, 100)}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}