import axios from 'axios';
import { lerToken } from './token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://10.20.120.15:4001',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = lerToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Mensagem de erro pronta pra mostrar na tela.
export function mensagemErro(err, padrao = 'Algo deu errado.') {
  if (!err?.response) {
    return err?.code === 'ECONNABORTED'
      ? 'O servidor demorou demais para responder.'
      : 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
  }
  const d = err.response.data;
  const e = d?.error;
  if (typeof e === 'string') return e;
  if (typeof d?.message === 'string') return d.message;
  return e?.message ?? padrao;
}

export default api;
