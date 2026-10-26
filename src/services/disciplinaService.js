import api from './api';
import { USE_MOCK, atraso, novoId } from './mock';

// AJUSTE AQUI a rota e os campos conforme o seu backend.
const disciplinas = [];

export async function criar({ name, descricao }) {
  if (USE_MOCK) {
    await atraso();
    const nova = { id: novoId(), name, descricao };
    disciplinas.push(nova);
    return { ...nova };
  }

  const { data } = await api.post('/disciplinas', { name, descricao });
  return data;
}
