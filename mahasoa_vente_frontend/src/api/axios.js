import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Erreur réseau ou serveur injoignable');
    } else {
      console.error(`Erreur HTTP ${error.response.status}:`, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;