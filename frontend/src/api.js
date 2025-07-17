import axios from 'axios';

const api = axios.create({
  // URL base
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

export default api;