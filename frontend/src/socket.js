// src/socket.js
import { io } from 'socket.io-client';

// Pega a URL da nossa API das variáveis de ambiente
const URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Cria a conexão do socket
export const socket = io(URL, {
  autoConnect: false // Vamos conectar manualmente quando precisarmos
});