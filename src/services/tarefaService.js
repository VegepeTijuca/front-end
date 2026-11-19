import api from './api';

function deApi(t) {
  return {
    id: t.id ?? t._id,
    name: t.name,
  };
}

export async function listar() {
  const { data } = await api.get('/tarefas');
  return data.map(deApi);
}

export async function criar(name) {
  const { data } = await api.post('/tarefas', { name });
  return deApi(data);
}

export async function atualizar(id, patch) {
  const { data } = await api.put(`/tarefas/${id}`, patch);
  return deApi(data);
}

export async function remover(id) {
  await api.delete(`/tarefas/${id}`);
}
