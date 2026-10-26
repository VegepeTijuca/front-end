import api from './api';

// AJUSTE AQUI a rota e os campos conforme o seu backend.
export async function criar({ name, descricao, dataConclusao }) {
  const { data } = await api.post('/conteudos', { name, descricao, dataConclusao });
  return data;
}
