import { useMemo, useState, useEffect } from 'react';
import { useSlots } from '../../slots/hooks/useSlots';
import { useActiveHunt } from './useActiveHunt';

export function useSmartSuggestions() {
  const { data: slots } = useSlots();
  const { hunt } = useActiveHunt();
  const [chatPick, setChatPick] = useState(null);

  // Simula o chat a spammar (a cada 30 segs)
  useEffect(() => {
    if (!slots || slots.length === 0) return;
    const interval = setInterval(() => {
      const randomSlot = slots[Math.floor(Math.random() * slots.length)];
      setChatPick({ slot: randomSlot, user: 'Viewer_Maluco99', votes: Math.floor(Math.random() * 15) + 3 });
    }, 30000);
    return () => clearInterval(interval);
  }, [slots]);

  // A "IA" escolhe com base no RTP e na última jogada
  const aiPick = useMemo(() => {
    if (!slots || !hunt || hunt.slots.length === 0) return null;

    const lastPlayed = hunt.slots[hunt.slots.length - 1];
    const huntSlotNames = hunt.slots.map(s => s.slotName);
    
    const sameProviderSlots = slots.filter(s => 
      s.provider === lastPlayed.provider && !huntSlotNames.includes(s.name)
    );

    if (sameProviderSlots.length > 0) {
      return sameProviderSlots.sort((a, b) => b.theoreticalRtp - a.theoreticalRtp)[0];
    }

    const highRtpSlots = slots.filter(s => s.theoreticalRtp > 96 && !huntSlotNames.includes(s.name));
    return highRtpSlots.length > 0 ? highRtpSlots[0] : slots[0];

  }, [slots, hunt]);

  return { aiPick, chatPick };
}