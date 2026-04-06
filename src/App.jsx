import { Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import SlotsPage from './pages/SlotsPage';
import BonusHuntPage from './pages/BonusHuntPage';
import SinglePlayerPage from './pages/SinglePlayerPage';
import HistoryPage from './pages/HistoryPage';

import { LayoutDashboard, Disc, PlusSquare, Gamepad2, History } from 'lucide-react';

export default function App() {
  // 🚀 A App agora é super leve! Não precisa de verificar sessões.
  // Deixamos essa inteligência para o DashboardPage e para as outras páginas.

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* NAVBAR LIMPÍSSIMA */}
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
        
        {/* Lado Esquerdo: Logo */}
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#38bdf8', letterSpacing: '1px', width: '200px' }}>
          CASINO DASH v2.0
        </div>
        
        {/* Centro: Links */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/" style={navLinkStyle}><LayoutDashboard size={18}/> Dashboard</Link>
          <Link to="/slots" style={navLinkStyle}><PlusSquare size={18}/> Slots</Link>
          <Link to="/single-player" style={navLinkStyle}><Gamepad2 size={18}/> Single Player</Link>
          <Link to="/history" style={navLinkStyle}><History size={18}/> Histórico</Link>
          <Link to="/bonus-hunt" style={navLinkStyle}><Disc size={18}/> Bonus Hunt</Link>
        </div>

        {/* Lado Direito: Espaço vazio para manter o menu centrado na perfeição */}
        <div style={{ width: '200px' }}></div>
      </nav>

      {/* MAIN CONTENT: As rotas mandam aqui */}
      {/* Removi o padding daqui para que o CSS do DashboardPage.module.css possa assumir o controlo */}
      <main style={{ flex: 1, width: '100%' }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/slots" element={<SlotsPage />} />
          <Route path="/single-player" element={<SinglePlayerPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/bonus-hunt" element={<BonusHuntPage />} />
        </Routes>
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
  fontWeight: '500',
  transition: 'color 0.2s ease'
};