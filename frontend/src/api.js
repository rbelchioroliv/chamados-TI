// src/api.js
import axios from 'axios';

const api = axios.create({
  // URL base do nosso back-end que está rodando na porta 3001
  baseURL: 'http://localhost:3001/api',
});

export default api;