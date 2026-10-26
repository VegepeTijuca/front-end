import axios from 'axios';

// O token fica só em memória (sem localStorage). Quem define é o AuthProvider.
let token = null;
export function definirToken(novoToken) {
  token = novoToken;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
