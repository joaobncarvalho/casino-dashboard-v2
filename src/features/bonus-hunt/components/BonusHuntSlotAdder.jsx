import { useState, useRef, useEffect } from 'react';
import { useSlots } from '../../slots/hooks/useSlots';
import { useActiveHunt } from '../hooks/useActiveHunt';
import { Search, Plus, Loader2, X } from 'lucide-react';
import styles from './BonusHuntSlotAdder.module.css';

export default function BonusHuntSlotAdder() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  
  const { data: slots, isLoading } = useSlots();
  const { hunt, addSlot } = useActiveHunt();

  // Fecha a lista ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSlots = query.length > 1 
    ? slots?.filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleAdd = (slot) => {
    if (!hunt) return;
    
    // Preparar o objeto para a API v2.0
    const slotData = {
      slotName: slot.name,
      betSize: 0, // O streamer define depois na tabela
      imageUrl: slot.imageUrl,
      theoreticalRtp: slot.theoreticalRtp
    };

    addSlot({ huntId: hunt.id, slot: slotData });
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.searchWrapper}>
        <Search size={18} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Pesquisar slot para adicionar..." 
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && <X size={16} className={styles.clearIcon} onClick={() => setQuery("")} />}
      </div>

      {isOpen && query.length > 1 && (
        <div className={styles.results}>
          {isLoading ? (
            <div className={styles.status}><Loader2 className={styles.spin} /></div>
          ) : filteredSlots.length > 0 ? (
            filteredSlots.map(slot => (
              <div key={slot.id} className={styles.resultItem} onClick={() => handleAdd(slot)}>
                <img src={slot.imageUrl || '/fallback.png'} alt="" />
                <div className={styles.info}>
                  <span className={styles.name}>{slot.name}</span>
                  <span className={styles.provider}>{slot.provider}</span>
                </div>
                <Plus size={16} className={styles.plusIcon} />
              </div>
            ))
          ) : (
            <div className={styles.status}>Nenhuma slot encontrada.</div>
          )}
        </div>
      )}
    </div>
  );
}