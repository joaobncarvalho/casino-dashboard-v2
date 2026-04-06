import StatisticsGrid from '../features/dashboard/components/StatisticsGrid';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Dashboard Global</h1>
        <p>Estatísticas consolidadas da tua live em tempo real.</p>
      </header>

      <StatisticsGrid />
      
      {/* Aqui entrarão os gráficos e as listas de bónus recentes no futuro */}
    </div>
  );
}