// src/pages/BonusHuntPage.jsx (Atualizada)
import BonusHuntTable from '../features/bonus-hunt/components/BonusHuntTable';
import BonusHuntForm from '../features/bonus-hunt/components/BonusHuntForm';
import BonusHuntSlotAdder from '../features/bonus-hunt/components/BonusHuntSlotAdder'; // Importação
import { useActiveHunt } from '../features/bonus-hunt/hooks/useActiveHunt';
import SmartSuggestions from '../features/bonus-hunt/components/SmartSuggestions';
import { Disc, Loader2 } from 'lucide-react';

export default function BonusHuntPage() {
    const { hunt, isLoading } = useActiveHunt();

    if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="spin" /></div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                    <Disc size={40} color="#38bdf8" /> Bonus Hunt v2.0
                </h1>
                <p style={{ color: '#94a3b8' }}>Gere os teus bónus e calcula o Break Even em tempo real.</p>
            </header>

            {!hunt ? (
                <BonusHuntForm />
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <BonusHuntSlotAdder />
                    </div>

                    {/* NOVA FUNCIONALIDADE AQUI */}
                    <SmartSuggestions />

                    <BonusHuntTable />
                </>
            )}
        </div>
    );
}