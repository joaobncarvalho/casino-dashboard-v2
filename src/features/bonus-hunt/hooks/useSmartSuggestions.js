import { useMemo, useState, useEffect } from 'react';
import { useSlots } from '../../slots/hooks/useSlots';
import { useActiveHunt } from './useActiveHunt';

export function useSmartSuggestions() {
  const { data: slots = [] } = useSlots(); // Fallback imediato para array vazio
  const { hunt } = useActiveHunt();
  const [chatPick, setChatPick] = useState(null);

  // 1. Simulação do Chat (Safe)
  useEffect(() => {
    if (!slots || slots.length === 0) return;
    
    const interval = setInterval(() => {
      const randomSlot = slots[Math.floor(Math.random() * slots.length)];
      setChatPick({ 
        slot: randomSlot, 
        user: 'Viewer_Maluco99', 
        votes: Math.floor(Math.random() * 15) + 3 
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [slots]);

  // 2. IA Pick (Blindada contra undefined e arrays vazios)
  const aiPick = useMemo(() => {
    // CORREÇÃO: Optional chaining e verificação rigorosa
    const activeSlots = hunt?.slots ?? [];
    if (!slots.length || !hunt || activeSlots.length === 0) {
      // Fallback: Se não há slots na hunt, sugere apenas um slot de alto RTP
      return slots.find(s => s.theoreticalRtp > 96) || slots[0] || null;
    }

    const lastPlayed = activeSlots[activeSlots.length - 1];
    const huntSlotNames = activeSlots.map(s => s.slotName);
    
    // Sugerir slots do mesmo provider que ainda não estão na hunt
    const sameProviderSlots = slots.filter(s => 
      s.provider === lastPlayed?.provider && !huntSlotNames.includes(s.name)
    );

    if (sameProviderSlots.length > 0) {
      return sameProviderSlots.sort((a, b) => (b.theoreticalRtp ?? 0) - (a.theoreticalRtp ?? 0))[0];
    }

    // Fallback para High RTP geral
    const highRtpSlots = slots.filter(s => (s.theoreticalRtp ?? 0) > 96 && !huntSlotNames.includes(s.name));
    return highRtpSlots.length > 0 ? highRtpSlots[0] : slots[0];

  }, [slots, hunt]);

  return { aiPick, chatPick };
}