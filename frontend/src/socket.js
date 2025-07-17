import { io } from 'socket.io-client';

//variáveis de ambiente
const URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// conexão do socket
export const socket = io(URL, {
  autoConnect: false 
});