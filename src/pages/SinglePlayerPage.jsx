import SinglePlayerMode from '../features/slots/components/SinglePlayerMode';
import { Gamepad2 } from 'lucide-react';

export default function SinglePlayerPage() {
  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Gamepad2 size={32} color="#00ff88" /> Single Player Mode
        </h1>
        <p style={{ color: '#94a3b8' }}>Regista bónus individuais e acompanha a performance histórica de cada slot.</p>
      </header>

      <SinglePlayerMode />
    </div>
  );
}