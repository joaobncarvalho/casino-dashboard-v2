import { useSessionHistory } from '../hooks/useSessionHistory';
import { Calendar, TrendingUp, TrendingDown, Clock, Loader2, BarChart3 } from 'lucide-react';
import styles from './SessionHistory.module.css';

export default function SessionHistory() {
  const { data: history, isLoading } = useSessionHistory();

  if (isLoading) return <div className={styles.center}><Loader2 className={styles.spin} /></div>;

  if (!history?.length) {
    return (
      <div className={styles.emptyState}>
        <BarChart3 size={48} />
        <p>Ainda não tens sessões finalizadas no histórico.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {history.map(session => {
        const pnl = session.currentBalance - session.initialBalance;
        const isProfit = pnl >= 0;
        const date = new Date(session.startTime).toLocaleDateString();

        return (
          <div key={session.id} className={styles.sessionCard}>
            <div className={styles.cardMain}>
              <div className={styles.info}>
                <div className={styles.dateRow}>
                  <Calendar size={14} /> <span>{date}</span>
                </div>
                <h3>{session.title}</h3>
              </div>

              <div className={`${styles.pnlBadge} ${isProfit ? styles.profit : styles.loss}`}>
                {isProfit ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                <span>{isProfit ? '+' : ''}${pnl.toFixed(2)}</span>
              </div>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detail}>
                <span className={styles.label}>START</span>
                <span className={styles.val}>${session.initialBalance.toFixed(2)}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>END</span>
                <span className={styles.val}>${session.currentBalance.toFixed(2)}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>DURATION</span>
                <span className={styles.val}><Clock size={12}/> {calculateDuration(session)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function calculateDuration(session) {
  if (!session.endTime) return "N/A";
  const diff = new Date(session.endTime) - new Date(session.startTime);
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${mins}m`;
}