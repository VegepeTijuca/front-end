import api from './api';
import { USE_MOCK, atraso } from './mock';
import { ehVisitante, gravarLocal, lerLocal, novoIdLocal } from './visitante';

// AJUSTE AQUI: de/para entre o backend e o formato usado na tela.
function deApi(t) {
  return {
    id: t.id ?? t._id,
    text: t.text,
    done: Boolean(t.done),
    starred: Boolean(t.starred),
  };
}

// --- dados locais (sem backend, ou no modo visitante) ---
const usaLocal = () => USE_MOCK || ehVisitante();

const tarefasIniciais = () =>
  ehVisitante()
    ? [
        { id: novoIdLocal(), text: 'Resolver lista de exercícios de Matemática', done: false, starred: true },
        { id: novoIdLocal(), text: 'Ler o capítulo 3 de História', done: false, starred: false },
        { id: novoIdLocal(), text: 'Fazer resumo de Português', done: true, starred: false },
      ]
    : [];

const lerTarefas = () => lerLocal('tarefas', tarefasIniciais);

export async function listar() {
  if (usaLocal()) {
    await atraso(100);
    return lerTarefas();
  }

  const { data } = await api.get('/tarefas');
  return data.map(deApi);
}

export async function criar(text) {
  if (usaLocal()) {
    await atraso(100);
    const nova = { id: novoIdLocal(), text, done: false, starred: false };
    gravarLocal('tarefas', [...lerTarefas(), nova]);
    return { ...nova };
  }

  const { data } = await api.post('/tarefas', { text });
  return deApi(data);
}

export async function atualizar(id, patch) {
  if (usaLocal()) {
    await atraso(100);
    const lista = lerTarefas().map((t) => (t.id === id ? { ...t, ...patch } : t));
    gravarLocal('tarefas', lista);
    return { ...lista.find((t) => t.id === id) };
  }

  const { data } = await api.patch(`/tarefas/${id}`, patch);
  return deApi(data);
}

export async function remover(id) {
  if (usaLocal()) {
    await atraso(100);
    gravarLocal('tarefas', lerTarefas().filter((t) => t.id !== id));
    return;
  }

  await api.delete(`/tarefas/${id}`);
}
