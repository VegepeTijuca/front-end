import api from './api';

// AJUSTE AQUI: de/para entre o backend e o formato usado na tela.
function deApi(t) {
  return {
    id: t.id ?? t._id,
    text: t.text,
    done: Boolean(t.done),
    starred: Boolean(t.starred),
  };
}

export async function listar() {
  const { data } = await api.get('/tarefas');
  return data.map(deApi);
}

export async function criar(text) {
  const { data } = await api.post('/tarefas', { text });
  return deApi(data);
}

export async function atualizar(id, patch) {
  const { data } = await api.patch(`/tarefas/${id}`, patch);
  return deApi(data);
}

export async function remover(id) {
  await api.delete(`/tarefas/${id}`);
}
