import { Routes, Route, Link } from 'react-router-dom';
import { useSession } from './context/SessionContext';
import SessionManager from './features/sessions/components/SessionManager';
import DashboardPage from './pages/DashboardPage';
import SlotsPage from './pages/SlotsPage';
import BonusHuntPage from './pages/BonusHuntPage';
import SinglePlayerPage from './pages/SinglePlayerPage';
import HistoryPage from './pages/HistoryPage';

// 👇 A ÚNICA LINHA DO LUCIDE-REACT 👇
import { LayoutDashboard, Disc, PlusSquare, Gamepad2, History } from 'lucide-react';

export default function App() {
  const { activeSession, isLoading } = useSession();

  if (isLoading) return <div style={{ padding: '2rem', color: '#38bdf8' }}>A aquecer motores v2.0...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav style={{ 
        padding: '1rem 2rem', 
        background: 'rgba(0,0,0,0.3)', 
        backdropFilter: 'blur(10px)',
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#38bdf8', letterSpacing: '1px' }}>
          CASINO DASH v2.0
        </div>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/" style={navLinkStyle}><LayoutDashboard size={18}/> Dashboard</Link>
          <Link to="/slots" style={navLinkStyle}><PlusSquare size={18}/> Slots</Link>
          <Link to="/single-player" style={navLinkStyle}><Gamepad2 size={18}/> Single Player</Link>
          <Link to="/history" style={navLinkStyle}><History size={18}/> Histórico</Link>
          <Link to="/bonus-hunt" style={navLinkStyle}><Disc size={18}/> Bonus Hunt</Link>
        </div>

        <SessionManager />
      </nav>

      <main style={{ flex: 1, padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {!activeSession ? (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Bem-vindo, João!</h2>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Inicia uma sessão para começar a trackear os teus bónus em tempo real.</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/slots" element={<SlotsPage />} />
            <Route path="/single-player" element={<SinglePlayerPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/bonus-hunt" element={<BonusHuntPage />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

const navLinkStyle = { 
  color: 'white', 
  textDecoration: 'none', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px',
  fontSize: '0.9rem',
  fontWeight: '500'
};