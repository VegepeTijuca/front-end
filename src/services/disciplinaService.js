import api from './api';

// AJUSTE AQUI a rota e os campos conforme o seu backend.
export async function criar({ name, descricao }) {
  const { data } = await api.post('/disciplinas', { name, descricao });
  return data;
}
