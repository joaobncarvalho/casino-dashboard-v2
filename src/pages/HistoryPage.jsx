import SessionHistory from '../features/sessions/components/SessionHistory';
import { History } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
          <History size={32} color="#a855f7" /> Histórico de Streams
        </h1>
        <p style={{ color: '#94a3b8' }}>Análise de performance e lucros das tuas sessões passadas.</p>
      </header>

      <SessionHistory />
    </div>
  );
}