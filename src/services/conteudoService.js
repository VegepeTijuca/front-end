import api from './api';

export async function criarConteudos(dados) {
  const { data } = await api.post('conteudos', dados);
  return data;
}

export async function getListaConteudos(disciplinaId) {
  const { data } = await api.get('conteudos', {
    params: disciplinaId ? { disciplinaId } : {},
  });
  return data;
}

export async function atualizarConteudo(id, dados) {
  const { data } = await api.put(`conteudos/${id}`, dados);
  return data;
}

export async function removerConteudo(id) {
  await api.delete(`conteudos/${id}`);
}
