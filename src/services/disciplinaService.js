import api from './api';

export async function criarDisciplinas(dados) {
  const { data } = await api.post('disciplinas', dados);
  return data;
}

export async function getListaDisciplinas() {
  const { data } = await api.get('disciplinas');
  return data;
}

export async function atualizarDisciplina(id, dados) {
  const { data } = await api.put(`disciplinas/${id}`, dados);
  return data;
}

export async function removerDisciplina(id) {
  await api.delete(`disciplinas/${id}`);
}
