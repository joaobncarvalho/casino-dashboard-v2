import { useSlots } from '../hooks/useSlots';
import { Search, Loader2, Info } from 'lucide-react';
import { useState } from 'react';
import styles from './SlotCatalog.module.css';

export default function SlotCatalog() {
  const { data: slots, isLoading } = useSlots();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSlots = slots?.filter(slot => 
    slot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slot.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className={styles.loader}><Loader2 className={styles.spin}/></div>;

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <Search size={20} />
        <input 
          placeholder="Pesquisar no catálogo..." 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.grid}>
        {filteredSlots?.map(slot => (
          <div key={slot.id} className={styles.slotCard}>
            <div className={styles.imageWrapper}>
              <img src={slot.imageUrl || '/fallback-slot.png'} alt={slot.name} />
              <div className={styles.rtpBadge}>{slot.rtp}% RTP</div>
            </div>
            <div className={styles.slotInfo}>
              <h4>{slot.name}</h4>
              <p>{slot.provider}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}