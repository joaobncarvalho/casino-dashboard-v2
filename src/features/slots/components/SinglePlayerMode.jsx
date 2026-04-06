import { useState } from 'react';
import { useSinglePlayer } from '../hooks/useSinglePlayer';
import { useSlots } from '../hooks/useSlots';
import { Search, Save, Trophy, History, Zap, Loader2, Play } from 'lucide-react';
import styles from './SinglePlayerMode.module.css';

export default function SinglePlayerMode() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bet, setBet] = useState("");
  const [win, setWin] = useState("");
  const [isSuper, setIsSuper] = useState(false);
  const [search, setSearch] = useState("");

  const { data: slots } = useSlots();
  const { stats, saveGame, isSaving, updateWidget } = useSinglePlayer(selectedSlot?.name);

  const handleSelect = (slot) => {
    setSelectedSlot(slot);
    updateWidget(slot.name); // Avisa o OBS que mudaste de slot
    setSearch("");
  };

  const handleSave = () => {
    if (!bet || !win) return;
    saveGame({
      slotName: selectedSlot.name,
      bet: parseFloat(bet),
      win: parseFloat(win),
      superMode: isSuper
    });
    setBet(""); setWin("");
  };

  return (
    <div className={styles.container}>
      {/* 1. Seleção de Slot */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <Search size={20} />
          <input 
            placeholder="Pesquisar slot para jogar..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <div className={styles.dropdown}>
            {slots?.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map(s => (
              <div key={s.id} className={styles.dropItem} onClick={() => handleSelect(s)}>
                <img src={s.imageUrl} alt="" />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSlot && (
        <div className={styles.gameGrid}>
          {/* 2. Painel de Input */}
          <div className={styles.inputPanel}>
            <div className={styles.slotHeader}>
              <img src={selectedSlot.imageUrl} alt="" />
              <div>
                <h2>{selectedSlot.name}</h2>
                <p>{selectedSlot.provider}</p>
              </div>
            </div>

            <div className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Aposta ($)</label>
                <input type="number" value={bet} onChange={e => setBet(e.target.value)} placeholder="0.00" />
              </div>
              <div className={styles.inputGroup}>
                <label>Ganho ($)</label>
                <input type="number" value={win} onChange={e => setWin(e.target.value)} placeholder="0.00" />
              </div>
              
              <button 
                className={`${styles.superToggle} ${isSuper ? styles.active : ''}`}
                onClick={() => setIsSuper(!isSuper)}
              >
                <Zap size={16} /> {isSuper ? 'SUPER BONUS ATIVO' : 'MODO NORMAL'}
              </button>

              <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className={styles.spin} /> : <Save size={18} />}
                Registar Jogada
              </button>
            </div>
          </div>

          {/* 3. Painel de Estatísticas em Tempo Real */}
          <div className={styles.statsPanel}>
            <div className={styles.statCard}>
              <Trophy size={24} color="#00ff88" />
              <div className={styles.statInfo}>
                <span className={styles.label}>BEST WIN</span>
                <span className={styles.value}>${stats?.bestWin?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <Zap size={24} color="#38bdf8" />
              <div className={styles.statInfo}>
                <span className={styles.label}>BEST MULTIPLIER</span>
                <span className={styles.value}>{stats?.bestMultiplier?.toFixed(1) || '0'}x</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <History size={24} color="#a855f7" />
              <div className={styles.statInfo}>
                <span className={styles.label}>LAST WIN</span>
                <span className={styles.value}>${stats?.lastWin?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            <div className={styles.avgBox}>
              <span className={styles.label}>AVERAGE MULTIPLIER</span>
              <div className={styles.avgValue}>{stats?.averageMultiplier?.toFixed(2) || '0.00'}x</div>
              <p>Baseado em {stats?.totalBonuses || 0} bónus registados</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}