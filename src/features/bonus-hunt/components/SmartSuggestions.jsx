import { useSmartSuggestions } from '../hooks/useSmartSuggestions';
import { useActiveHunt } from '../hooks/useActiveHunt';
import { Bot, MessageSquare, Plus, Zap } from 'lucide-react';
import styles from './SmartSuggestions.module.css';

export default function SmartSuggestions() {
  const { aiPick, chatPick } = useSmartSuggestions();
  const { hunt, addSlot } = useActiveHunt();

  const handleQuickAdd = (slot) => {
    if (!hunt || !slot) return;
    addSlot({ 
      huntId: hunt.id, 
      slot: { slotName: slot.name, betSize: 0, imageUrl: slot.imageUrl, theoreticalRtp: slot.theoreticalRtp } 
    });
  };

  if (!aiPick && !chatPick) return null;

  return (
    <div className={styles.container}>
      {/* Card da Inteligência Artificial */}
      {aiPick && (
        <div className={`${styles.card} ${styles.aiCard}`}>
          <div className={styles.header}>
            <Bot size={18} /> TechLead AI Pick
          </div>
          <div className={styles.content}>
            <img src={aiPick.imageUrl || '/fallback.png'} alt="" className={styles.slotImage} />
            <div className={styles.info}>
              <h4>{aiPick.name}</h4>
              <p>Match: {aiPick.provider} | Alta probabilidade</p>
            </div>
            <button onClick={() => handleQuickAdd(aiPick)} className={styles.addBtn}>
              <Plus size={16} /> Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Card da Sugestão do Chat */}
      {chatPick && (
        <div className={`${styles.card} ${styles.chatCard}`}>
          <div className={styles.header}>
            <MessageSquare size={18} /> Chat Escolheu (🔥 {chatPick.votes} votos)
          </div>
          <div className={styles.content}>
            <img src={chatPick.slot.imageUrl || '/fallback.png'} alt="" className={styles.slotImage} />
            <div className={styles.info}>
              <h4>{chatPick.slot.name}</h4>
              <p>Sugerido por: @{chatPick.user}</p>
            </div>
            <button onClick={() => handleQuickAdd(chatPick.slot)} className={styles.addBtn}>
              <Plus size={16} /> Adicionar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}