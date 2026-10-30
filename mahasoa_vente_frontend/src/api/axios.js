import axios from 'axios';

const RAW_URL = import.meta.env.VITE_API_URL;

if (!RAW_URL && import.meta.env.PROD) {
  console.error(
    "VITE_API_URL est absente du build : l'API sera appelée sur 127.0.0.1. " +
      "Définis VITE_API_URL sur Render puis redéploie avec Clear build cache."
  );
}

const BASE_URL = (RAW_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Ajoute /api/ devant toute route relative qui ne l'a pas déjà
api.interceptors.request.use((config) => {
  let url = String(config.url || '');
  if (!/^https?:\/\//i.test(url)) {
    url = url.replace(/^\/+/, '');
    if (!url.startsWith('api/')) url = 'api/' + url;
    config.url = '/' + url;
  }
  return config;
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