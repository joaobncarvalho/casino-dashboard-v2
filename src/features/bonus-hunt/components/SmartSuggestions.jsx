import { Plus } from 'lucide-react';
import { useActiveHunt } from '../hooks/useActiveHunt';
import { useSmartSuggestions } from '../hooks/useSmartSuggestions';
import styles from './SmartSuggestions.module.css';

export default function SmartSuggestions({ onSelectSlot }) {
  const { aiPick, chatPick } = useSmartSuggestions();
  const { hunt, addSlot } = useActiveHunt();

  const handleQuickAdd = (slot) => {
    if (!hunt || !slot) return;
    onSelectSlot(slot); // Abre o modal em vez de adicionar direto!
  };

  if (!aiPick && !chatPick) return null;

  const isHuntOpen = hunt?.status === "OPEN";

  return (
    <div className={styles.container}>
      {aiPick && (
        <div className={`${styles.card} ${styles.aiCard}`}>
          <div className={styles.content}>
            <img src={aiPick.imageUrl || '/fallback.png'} alt="" className={styles.slotImage} />
            <div className={styles.info}>
              <h4>{aiPick.name}</h4>
              <p>Match: {aiPick.provider}</p>
            </div>
            {isHuntOpen && (
              <button onClick={() => handleQuickAdd(aiPick)} className={styles.addBtn}>
                <Plus size={16} /> Adicionar
              </button>
            )}
          </div>
        </div>
      )}
      
      {chatPick && (
        <div className={`${styles.card} ${styles.chatCard}`}>
          <div className={styles.content}>
            <img src={chatPick.slot.imageUrl || '/fallback.png'} alt="" className={styles.slotImage} />
            <div className={styles.info}>
              <h4>{chatPick.slot.name}</h4>
              <p>Sugerido por: {chatPick.user}</p>
            </div>
            {isHuntOpen && (
              <button onClick={() => handleQuickAdd(chatPick.slot)} className={styles.addBtn}>
                <Plus size={16} /> Adicionar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}