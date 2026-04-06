import { useState } from 'react';
import { useCreateSlot } from '../hooks/useCreateSlot';
import { Upload, Save, Loader2 } from 'lucide-react';
import styles from './CreateSlotForm.module.css';

export default function CreateSlotForm() {
  const [slot, setSlot] = useState({ name: '', provider: '', theoreticalRtp: 96.5 });
  const [imageFile, setImageFile] = useState(null); // Agora guardamos o FICHEIRO real
  const [preview, setPreview] = useState(null);
  const { mutate, isPending } = useCreateSlot();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Guarda o ficheiro para o Backend
      
      // Cria o preview visual para o utilizador
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Voltamos ao formato JSON que a tua API de Java gosta!
    // O 'preview' já contém a imagem convertida em texto (Base64)
    const slotPayload = {
      name: slot.name,
      provider: slot.provider,
      rtp: slot.rtp,
      imageUrl: preview // A API Java deve estar a mapear isto para a string da imagem
    };

    mutate(slotPayload);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.imageUpload}>
        {preview ? <img src={preview} alt="Preview" /> : <Upload size={48} />}
        <input type="file" onChange={handleImageChange} accept="image/*" />
      </div>

      <div className={styles.inputs}>
        <input 
          placeholder="Nome da Slot" 
          onChange={e => setSlot({...slot, name: e.target.value})} 
          required 
        />
        <input 
          placeholder="Provider (Pragmatic, Hacksaw...)" 
          onChange={e => setSlot({...slot, provider: e.target.value})} 
          required 
        />
        <input 
          type="number" 
          step="0.1" 
          placeholder="RTP %" 
          onChange={e => setSlot({...slot, theoreticalRtp: parseFloat(e.target.value)})} 
        />
        
        <button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className={styles.spin} /> : <Save size={18} />}
          {isPending ? 'A Guardar...' : 'Adicionar ao Catálogo'}
        </button>
      </div>
    </form>
  );
}