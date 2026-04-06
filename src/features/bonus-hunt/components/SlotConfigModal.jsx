import { useState, useEffect } from 'react';
import { X, Zap, DollarSign, CheckCircle2 } from 'lucide-react';
import styles from './SlotConfigModal.module.css';

export default function SlotConfigModal({ slot, onClose, onConfirm }) {
  const [bet, setBet] = useState("0.20");
  const [isSuper, setIsSuper] = useState(false);

  // Foca no input da aposta assim que o modal abre
  useEffect(() => {
    const input = document.getElementById("bet-input");
    if (input) {
      input.focus();
      input.select(); // Seleciona o "0.20" logo para ser fácil de reescrever
    }
  }, []);

  if (!slot) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    const betValue = parseFloat(bet);
    if (isNaN(betValue) || betValue <= 0) return;
    
    onConfirm({
      ...slot,
      bet: betValue,
      superMode: isSuper
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeBtn}>
          <X size={20} />
        </button>
        
        <div className={styles.header}>
          <img 
            src={slot.imageUrl || '/fallback.png'} 
            alt={slot.name} 
            className={styles.image} 
          />
          <div>
            <h3 className={styles.title}>{slot.name}</h3>
            <span className={styles.provider}>{slot.provider}</span>
          </div>
        </div>

        <form onSubmit={handleConfirm} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Valor da Aposta</label>
            <div className={styles.inputWrapper}>
              <DollarSign size={18} color="#64748b" />
              <input 
                id="bet-input"
                type="number" 
                step="0.10"
                value={bet}
                onChange={(e) => setBet(e.target.value)}
                className={styles.input}
                required
              />
            </div>
          </div>

          {/* Toggle do Super Bónus */}
          <div 
            className={`${styles.superToggle} ${isSuper ? styles.active : ''}`}
            onClick={() => setIsSuper(!isSuper)}
          >
            <div className={styles.toggleInfo}>
              <Zap size={20} color={isSuper ? "#fbbf24" : "#64748b"} />
              <span>É um SUPER Bónus?</span>
            </div>
            <div className={styles.switch}>
              <div className={styles.switchDot} />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            <CheckCircle2 size={18} /> Adicionar à Hunt
          </button>
        </form>
      </div>
    </div>
  );
}