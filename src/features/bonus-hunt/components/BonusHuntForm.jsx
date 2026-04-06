import { useState } from 'react';
import { useCreateHunt } from '../hooks/useCreateHunt';
import { Disc, DollarSign, PlusCircle, Loader2 } from 'lucide-react';
import styles from './BonusHuntForm.module.css';

export default function BonusHuntForm() {
  const [name, setName] = useState(`Bonus Hunt #${new Date().toLocaleTimeString()}`);
  const [startAmount, setStartAmount] = useState("");
  const { mutate, isPending } = useCreateHunt();

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
          {isPending ? 'A criar Hunt...' : 'Iniciar Bonus Hunt'}
        </button>
      </form>
    </div>
  );
}