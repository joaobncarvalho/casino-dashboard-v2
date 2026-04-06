import { useState } from 'react';
import BonusHuntTable from '../features/bonus-hunt/components/BonusHuntTable';
import BonusHuntForm from '../features/bonus-hunt/components/BonusHuntForm';
import BonusHuntSlotAdder from '../features/bonus-hunt/components/BonusHuntSlotAdder';
import { useActiveHunt } from '../features/bonus-hunt/hooks/useActiveHunt';
import SmartSuggestions from '../features/bonus-hunt/components/SmartSuggestions';
import SlotConfigModal from '../features/bonus-hunt/components/SlotConfigModal';
import { Disc, Loader2, Lock, Play, Trophy } from 'lucide-react'; 

// 👇 IMPORTA O NOVO FICHEIRO DE ESTILOS AQUI 👇
import styles from './BonusHuntPage.module.css';

export default function BonusHuntPage() {
  const { hunt, isLoading, addSlot, startOpening, isStarting, finishHunt, isFinishing } = useActiveHunt();
  const [slotToConfig, setSlotToConfig] = useState(null);

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="spin" color="#38bdf8" size={32} /></div>;

  const handleConfirmAdd = (configuredSlot) => {
    addSlot(configuredSlot);
    setSlotToConfig(null);
  };

  const totalCount = hunt?.slots?.length || 0;
  const collectedCount = hunt?.slots?.filter(s => s.collected).length || 0;
  const allSlotsCollected = totalCount > 0 && collectedCount === totalCount;

  return (
    <div className={styles.container}>
      {slotToConfig && (
        <SlotConfigModal 
          slot={slotToConfig} 
          onClose={() => setSlotToConfig(null)} 
          onConfirm={handleConfirmAdd} 
        />
      )}

      <header className={styles.header}>
        <h1 className={styles.title}>
          <Disc size={40} color="#38bdf8" /> Bonus Hunt v2.0
        </h1>
        <p className={styles.subtitle}>Gere os teus bónus e calcula o Break Even em tempo real.</p>
      </header>

      {!hunt ? (
        <BonusHuntForm />
      ) : (
        <>
          <div className={styles.adderWrapper}>
            <BonusHuntSlotAdder onSelectSlot={setSlotToConfig} />
          </div>

          <SmartSuggestions onSelectSlot={setSlotToConfig} />

          {/* 🔥 PAINEL DE CONTROLO AGORA USA CSS MODULES 🔥 */}
          <div className={styles.controlPanel}>
            <div className={styles.panelInfo}>
              <h3 className={styles.panelTitle}>Lista de Bónus</h3>
              <p className={styles.panelSubtitle}>
                {hunt.status === 'OPEN' 
                  ? `Total guardado: ${totalCount} slots` 
                  : allSlotsCollected 
                    ? "✅ Todos os bónus foram abertos!" 
                    : `Progresso: ${collectedCount}/${totalCount} bónus`}
              </p>
            </div>

            {/* FASE 1: Botão de Iniciar */}
            {hunt.status === 'OPEN' && (
              <button 
                onClick={() => {
                  if(window.confirm("Trancar a lista e iniciar a abertura dos bónus? Já não poderás adicionar mais jogos!")) {
                    startOpening();
                  }
                }}
                disabled={isStarting}
                className={styles.btnStart}
              >
                {isStarting ? <Loader2 size={18} className="spin" /> : <Play size={18} fill="currentColor" />}
                Iniciar Abertura
              </button>
            )}

            {/* FASE 2: Cadeado de Progresso */}
            {hunt.status === 'COLLECTING' && !allSlotsCollected && (
              <div className={styles.lockStatus}>
                <Lock size={18} />
                Fase de Coleta (Lista Trancada)
              </div>
            )}

            {/* FASE 3: Botão de Finalizar */}
            {hunt.status === 'COLLECTING' && allSlotsCollected && (
              <button 
                onClick={() => {
                  if(window.confirm("Desejas finalizar esta Bonus Hunt? Os dados serão guardados no histórico da sessão.")) {
                    finishHunt();
                  }
                }}
                disabled={isFinishing}
                className={styles.btnFinish}
              >
                {isFinishing ? <Loader2 size={18} className="spin" /> : <Trophy size={18} />}
                Finalizar e Guardar
              </button>
            )}
          </div>

          <BonusHuntTable />
        </>
      )}
    </div>
  );
}