import api from './api';
import { USE_MOCK, atraso, novoId } from './mock';

// AJUSTE AQUI a rota e os campos conforme o seu backend.
const conteudos = [];

export async function criar({ name, descricao, dataConclusao }) {
  if (USE_MOCK) {
    await atraso();
    const novo = { id: novoId(), name, descricao, dataConclusao };
    conteudos.push(novo);
    return { ...novo };
  }

  const { data } = await api.post('/conteudos', { name, descricao, dataConclusao });
  return data;
}
