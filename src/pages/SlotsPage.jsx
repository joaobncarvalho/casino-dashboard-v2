import SlotCatalog from '../features/slots/components/SlotCatalog';
import CreateSlotForm from '../features/slots/components/CreateSlotForm';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function SlotsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Catálogo de Slots</h1>
          <p style={{ color: '#94a3b8' }}>Gere o teu inventário de jogos para as Bonus Hunts.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ 
            background: showForm ? '#ef4444' : '#38bdf8', 
            border: 'none', padding: '0.8rem 1.5rem', 
            borderRadius: '8px', color: '#0f172a', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          {showForm ? <X size={18}/> : <Plus size={18}/>}
          {showForm ? 'Fechar' : 'Nova Slot'}
        </button>
      </header>

      {showForm && (
        <div style={{ marginBottom: '3rem' }}>
          <CreateSlotForm />
        </div>
      )}

      <SlotCatalog />
    </div>
  );
}