import { Plus } from 'lucide-react';

import { useActiveHunt } from '../hooks/useActiveHunt';
import { useSmartSuggestions } from '../hooks/useSmartSuggestions';

import styles from './SmartSuggestions.module.css';

// Em SmartSuggestions.jsx, ajusta o handleQuickAdd e esconde os botões
export default function SmartSuggestions() {
  const { aiPick, chatPick } = useSmartSuggestions();
  const { hunt, addSlot } = useActiveHunt();

  const handleQuickAdd = (slot) => {
    if (!hunt || !slot) return;
    const bet = window.prompt(`Valor da aposta para ${slot.name}:`, "0.20");
    if (!bet || isNaN(parseFloat(bet))) return;
    const isSuper = window.confirm("Este é um SUPER Bónus?");
    
    addSlot({ ...slot, superMode: isSuper }, bet);
  };

  if (!aiPick && !chatPick) return null;

  // 🛑 UI LOCK: Define se os botões devem aparecer
  const isHuntOpen = hunt?.status === "OPEN";

  return (
    <div className={styles.container}>
      {/* Exemplo de aplicação no AI Pick: só renderiza o button se for true */}
      {aiPick && (
        <div className={`${styles.card} ${styles.aiCard}`}>
          {/* ... resto do card ... */}
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
      {/* Faz o mesmo isHuntOpen && (...) para o botão do ChatPick */}
    </div>
  );
}