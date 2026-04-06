import axios from 'axios';

const api = axios.create({
  // Desliga o servidor de produção provisoriamente
  // baseURL: 'https://twitch-api-k7y3.onrender.com', 
  
  // Liga o servidor local
  baseURL: 'http://localhost:8080', 
  
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;