import axios from 'axios';

// Começa com o token salvo (para continuar logado depois de F5)
let token = localStorage.getItem('token');

// Quem chama passa o token novo (ou null para sair)
export function definirToken(novoToken) {
  token = novoToken;
}

const api = axios.create({
  baseURL: 'http://10.20.104.38:3000/',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;