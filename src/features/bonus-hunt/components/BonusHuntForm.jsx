import { useState } from 'react';
import { useCreateHunt } from '../hooks/useCreateHunt';
import { Disc, DollarSign, PlusCircle, Loader2, AlertCircle } from 'lucide-react';
import styles from './BonusHuntForm.module.css';

export default function BonusHuntForm() {
  const [name, setName] = useState(`Bonus Hunt #${new Date().toLocaleTimeString()}`);
  const [startAmount, setStartAmount] = useState("");
  
  // 🚀 Extraímos também a variável "error" do nosso hook
  const { mutate, isPending, error } = useCreateHunt();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startAmount) return;
    
    mutate({ name, startAmount: parseFloat(startAmount) });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Disc className={styles.spinIcon} size={24} />
        <h2>Nova Caça aos Bónus</h2>
      </div>

      {/* 🔥 BANNER DE ERRO PREMIUM 🔥 */}
      {error && (
        <div style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          color: '#ef4444', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          border: '1px solid rgba(239, 68, 68, 0.3)' 
        }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: '500' }}>{error.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Identificação da Hunt</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Noite de Hacksaw #1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Valor Inicial (Custo Total)</label>
          <div className={styles.priceInput}>
            <DollarSign size={18} />
            <input 
              type="number" 
              value={startAmount}
              onChange={(e) => setStartAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isPending}>
          {isPending ? <Loader2 className={styles.spin} /> : <PlusCircle size={20} />}
          {isPending ? 'A processar...' : 'Iniciar Bonus Hunt'}
        </button>
      </form>
    </div>
  );
}