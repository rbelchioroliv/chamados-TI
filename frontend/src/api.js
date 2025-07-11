// src/api.js
import axios from 'axios';

const api = axios.create({
  // URL base do nosso back-end que está rodando na porta 3001
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

export default api;