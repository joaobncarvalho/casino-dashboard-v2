import { useActiveHunt } from '../hooks/useActiveHunt';
import { CheckCircle2, Circle, DollarSign, Calculator } from 'lucide-react';
import styles from './BonusHuntTable.module.css';

export default function BonusHuntTable() {
  const { hunt, collectWin } = useActiveHunt();

  if (!hunt) return <div className={styles.noHunt}>Nenhuma Bonus Hunt ativa. Cria uma para começar!</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.huntHeader}>
        <div className={styles.beInfo}>
          <span><Calculator size={16}/> BE Inicial: <strong>{hunt.initialBreakEven?.toFixed(2)}x</strong></span>
          <span><Activity size={16}/> BE Atual: <strong>{hunt.currentBreakEven?.toFixed(2)}x</strong></span>
        </div>
      </div>

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
          {hunt.slots.map((s, index) => (
            <tr key={index} className={s.collected ? styles.collectedRow : ''}>
              <td className={styles.slotCell}>
                <img src={s.imageUrl} alt="" />
                {s.slotName}
              </td>
              <td>${s.betSize.toFixed(2)}</td>
              <td>
                {s.collected ? (
                  <span className={styles.winValue}>${s.winAmount.toFixed(2)}</span>
                ) : (
                  <input 
                    type="number" 
                    placeholder="0.00"
                    onBlur={(e) => collectWin({ huntId: hunt.id, slotName: s.slotName, amount: e.target.value })}
                  />
                )}
              </td>
              <td>{(s.winAmount / s.betSize).toFixed(1)}x</td>
              <td>
                {s.collected ? <CheckCircle2 color="#00ff88" /> : <Circle color="#64748b" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}