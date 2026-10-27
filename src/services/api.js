import axios from 'axios';

// O token fica só em memória (sem localStorage). Quem define é o AuthProvider.
let token = null;
export function definirToken() {
  const novoToken = localStorage.getItem('token');
  token = novoToken;
}

const baseURL = axios.create({
  baseURL: "http://10.20.104.38:3000/",
  timeout: 10000,
});

definirToken();
baseURL.interceptors.request.use((config) => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default baseURL;
