import api from './api';

// O backend espera: { name, descricao, disciplina_id }
export async function criarConteudos({ name, descricao, disciplinaId }) {
  const { data } = await api.post('conteudos', {
    name,
    descricao,
    disciplina_id: disciplinaId,
  });
  return data;
}

export async function getListaConteudos(disciplinaId) {
  const { data } = await api.get('conteudos', {
    params: disciplinaId ? { disciplinaId } : {},
  });
  return data;
}
