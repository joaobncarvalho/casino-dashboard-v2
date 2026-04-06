import { useState } from 'react';
import { useActiveHunt } from '../hooks/useActiveHunt';
import { CheckCircle2, Circle, Lock, Check, Trophy } from 'lucide-react'; 
import styles from './BonusHuntTable.module.css';

export default function BonusHuntTable() {
  const { hunt, updateBet, collectWin, isCollecting } = useActiveHunt();
  // Estado temporário para o valor que estás a digitar na slot atual
  const [currentWinInput, setCurrentWinInput] = useState("");

  if (!hunt) return null;

  const isEditable = hunt.status === 'OPEN';
  
  // 🧠 LÓGICA SNIPER: Descobre qual é a primeira slot que AINDA NÃO FOI coletada
  const activeIndex = hunt.slots?.findIndex(s => !s.collected);

  // Função para submeter o prémio
  const handleConfirmWin = (slotName) => {
    const amount = parseFloat(currentWinInput);
    if (isNaN(amount) || amount < 0) return;

    collectWin({ huntId: hunt.id || hunt._id, slotName, amount });
    setCurrentWinInput(""); // Limpa o input para a próxima slot
  };

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Slot</th>
            <th>Aposta</th>
            <th>Prémio</th>
            <th>Multiplicador</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {(hunt.slots ?? []).map((s, index) => {
            const multiplier = s.bet > 0 && s.win > 0 ? (s.win / s.bet) : 0;
            const isCurrentlyOpening = index === activeIndex && hunt.status === 'COLLECTING';
            const isWaiting = index > activeIndex && hunt.status === 'COLLECTING';

            return (
              <tr key={index} className={s.collected ? styles.collectedRow : (isCurrentlyOpening ? styles.activeRow : '')}>
                <td className={styles.slotCell}>
                  <img src={s.imageUrl || '/fallback.png'} alt="" /> 
                  <div className={styles.slotInfo}>
                    <span className={styles.slotName}>{s.name}</span>
                    {s.superMode && <span className={styles.superBadge}>SUPER</span>}
                  </div>
                </td>
                
                {/* COLUNA APOSTA */}
                <td>
                  {isEditable ? (
                    <input 
                      type="number"
                      step="0.10"
                      defaultValue={s.bet}
                      className={styles.inlineInput}
                      onBlur={(e) => updateBet(s.name, parseFloat(e.target.value))}
                    />
                  ) : (
                    <span className={styles.betText}>${(s.bet || 0).toFixed(2)}</span>
                  )}
                </td>

                {/* COLUNA PRÉMIO (A Mágica acontece aqui) */}
                <td>
                  {isEditable ? (
                    <span className={styles.muted}>Aguardando abertura...</span>
                  ) : s.collected ? (
                    // Já foi coletado, mostra o valor fixo bonito
                    <span className={styles.winText}>${(s.win || 0).toFixed(2)}</span>
                  ) : isCurrentlyOpening ? (
                    // É a vez desta slot! Mostra o input e o botão de confirmar
                    <div className={styles.actionGroup}>
                      <input 
                        type="number"
                        placeholder="0.00"
                        value={currentWinInput}
                        onChange={(e) => setCurrentWinInput(e.target.value)}
                        className={styles.winInput}
                        autoFocus // Foca logo no input para não teres de clicar!
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleConfirmWin(s.name);
                        }}
                      />
                      <button 
                        className={styles.confirmBtn}
                        onClick={() => handleConfirmWin(s.name)}
                        disabled={!currentWinInput}
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  ) : isWaiting ? (
                    // Ainda não é a vez desta slot, está bloqueada
                    <div className={styles.lockedText}>
                      <Lock size={14} /> Na fila...
                    </div>
                  ) : null}
                </td>

                {/* COLUNA MULTIPLICADOR */}
                <td>
                  {s.collected ? (
                    <span className={multiplier >= 100 ? styles.highX : styles.normalX}>
                      {multiplier.toFixed(1)}x
                    </span>
                  ) : (
                    <span className={styles.muted}>-</span>
                  )}
                </td>

                {/* COLUNA STATUS */}
                <td>
                  {s.collected ? (
                    <CheckCircle2 color="#10b981" size={20} />
                  ) : isCurrentlyOpening ? (
                    <Trophy color="#fbbf24" size={20} className={styles.pulseIcon} />
                  ) : (
                    <Circle color="#334155" size={20} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}