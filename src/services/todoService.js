import api from './api';
import { USE_MOCK, atraso, novoId } from './mock';

// AJUSTE AQUI: de/para entre o backend e o formato usado na tela.
function deApi(t) {
  return {
    id: t.id ?? t._id,
    text: t.text,
    done: Boolean(t.done),
    starred: Boolean(t.starred),
  };
}

// --- dados em memória (só enquanto não há backend) ---
let tarefas = [];

export async function listar() {
  if (USE_MOCK) {
    await atraso();
    return tarefas.map((t) => ({ ...t }));
  }

  const { data } = await api.get('/tarefas');
  return data.map(deApi);
}

export async function criar(text) {
  if (USE_MOCK) {
    await atraso(100);
    const nova = { id: novoId(), text, done: false, starred: false };
    tarefas = [...tarefas, nova];
    return { ...nova };
  }

  const { data } = await api.post('/tarefas', { text });
  return deApi(data);
}

export async function atualizar(id, patch) {
  if (USE_MOCK) {
    await atraso(100);
    tarefas = tarefas.map((t) => (t.id === id ? { ...t, ...patch } : t));
    return { ...tarefas.find((t) => t.id === id) };
  }

  const { data } = await api.patch(`/tarefas/${id}`, patch);
  return deApi(data);
}

export async function remover(id) {
  if (USE_MOCK) {
    await atraso(100);
    tarefas = tarefas.filter((t) => t.id !== id);
    return;
  }

  await api.delete(`/tarefas/${id}`);
}
