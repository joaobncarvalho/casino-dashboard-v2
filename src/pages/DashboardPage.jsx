import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import StatisticsGrid from '../features/dashboard/components/StatisticsGrid';
import SessionManager from '../features/sessions/components/SessionManager';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  // Verificamos o estado da sessão diretamente na página
  const { data: activeSession, isLoading } = useQuery({
    queryKey: ['active-session'],
    queryFn: async () => {
      const res = await api.get('/sessions/active');
      if (res.status === 204 || !res.data || Object.keys(res.data).length === 0) return null;
      return res.data;
    }
  });

  if (isLoading) return null; // Evita piscar o ecrã enquanto verifica

  return (
    <div className={styles.page}>
      {!activeSession ? (
        /* ESTADO OFFLINE: Layout Bonito e Centrado */
        <div className={styles.offlineHero}>
          <div className={styles.welcomeText}>
            <h1>Bem-vindo, João! 🎯</h1>
            <p>
              O teu painel de controlo está pronto. Inicia uma nova sessão para 
              começares a trackear os teus bónus, lucros e o luck factor em tempo real.
            </p>
          </div>
          <div className={styles.setupWrapper}>
            <SessionManager />
          </div>
        </div>
      ) : (
        /* ESTADO ONLINE: Layout de Dashboard Profissional */
        <>
          <header className={styles.header}>
            <div className={styles.headerTitles}>
              <h1>Dashboard Global</h1>
              <p>Estatísticas consolidadas da tua live em tempo real.</p>
            </div>
            {/* O Botão de "LIVE / Encerrar" vai aparecer perfeitamente aqui à direita */}
            <div className={styles.liveControl}>
              <SessionManager />
            </div>
          </header>

          <StatisticsGrid />
          
          {/* Futuros gráficos entrarão aqui */}
        </>
      )}
    </div>
  );
}