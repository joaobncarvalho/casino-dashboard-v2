import { useActiveHunt } from '../hooks/useActiveHunt';
import { CheckCircle2, Circle, Calculator, Activity } from 'lucide-react'; 
import styles from './BonusHuntTable.module.css';

export default function BonusHuntTable() {
  const { hunt, updateBet, collectWin } = useActiveHunt();
  if (!hunt) return null;

  const isEditable = hunt.status === 'OPEN';

  return (
    <div className={styles.wrapper}>
      {/* ... header ... */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Slot</th>
            <th>Aposta</th>
            <th>Prémio</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {(hunt.slots ?? []).map((s, index) => (
            <tr key={index}>
              <td className={styles.slotCell}>
                <img src={s.imageUrl} alt="" /> {s.name}
              </td>
              
              {/* COLUNA APOSTA: Editável se OPEN, Texto se COLLECTING */}
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
                  <span>${s.bet.toFixed(2)}</span>
                )}
              </td>

              <td>
                {!isEditable ? (
                  <input 
                    type="number"
                    placeholder="0.00"
                    onBlur={(e) => collectWin({ huntId: hunt.id, slotName: s.name, amount: parseFloat(e.target.value) })}
                  />
                ) : (
                  <span className={styles.muted}>Aguardando abertura...</span>
                )}
              </td>
              {/* ... status ... */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}