import { useQuery } from '@tanstack/react-query';
import api from '../../../api/client';
import { TrendingUp, TrendingDown, DollarSign, Activity, Percent, Loader2 } from 'lucide-react';
import styles from './StatisticsGrid.module.css';

export default function StatisticsGrid() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['live-stats'],
    queryFn: () => api.get('/sessions/active/stats'),
    refetchInterval: 5000,
    retry: 3
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} />
        <span>A processar PnL em tempo real...</span>
      </div>
    );
  }

  if (error || !stats) return null;

  const isProfit = stats.netPnl >= 0;

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
            ${Math.abs(stats.netPnl).toFixed(2)}
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
          <h2>${stats.totalWagered.toFixed(2)}</h2>
          <p className={styles.subtext}>Volume total apostado</p>
        </div>
      </div>

      <div className={styles.glassCard}>
        <div className={styles.cardHeader}>
          <Percent size={18} className={styles.iconPurple} />
          <span>LUCK FACTOR</span>
        </div>
        <div className={styles.cardBody}>
          <h2>{stats.luckFactor.toFixed(1)}%</h2>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${Math.min(stats.luckFactor, 100)}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}