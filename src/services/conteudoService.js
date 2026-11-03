import api from './api';
import { atraso } from './mock';
import { conteudosIniciais } from './disciplinaService';
import { ehVisitante, gravarLocal, lerLocal, novoIdLocal } from './visitante';

// modo visitante: conteúdos guardados no navegador
const lerConteudos = () => lerLocal('conteudos', conteudosIniciais);

export async function criarConteudos(dados) {
  if (ehVisitante()) {
    await atraso(100);
    const novo = {
      id: novoIdLocal(),
      name: dados.name,
      descricao: dados.descricao ?? '',
      disciplinaId: dados.disciplinaId,
    };
    gravarLocal('conteudos', [...lerConteudos(), novo]);
    return novo;
  }

  const { data } = await api.post('conteudos', dados);
  return data;
}

export async function getListaConteudos(disciplinaId) {
  if (ehVisitante()) {
    await atraso(100);
    const todos = lerConteudos();
    return disciplinaId ? todos.filter((c) => c.disciplinaId === disciplinaId) : todos;
  }

  const { data } = await api.get('conteudos', {
    params: disciplinaId ? { disciplinaId } : {},
  });
  return data;
}

// AJUSTE AQUI: rota de edição conforme o seu backend (ainda não testada).
export async function atualizarConteudo(id, dados) {
  if (ehVisitante()) {
    await atraso(100);
    const lista = lerConteudos().map((c) => (c.id === id ? { ...c, ...dados } : c));
    gravarLocal('conteudos', lista);
    return lista.find((c) => c.id === id);
  }

  const { data } = await api.put(`conteudos/${id}`, dados);
  return data;
}

// AJUSTE AQUI: rota de exclusão conforme o seu backend (ainda não testada).
export async function removerConteudo(id) {
  if (ehVisitante()) {
    await atraso(100);
    gravarLocal('conteudos', lerConteudos().filter((c) => c.id !== id));
    return;
  }

  await api.delete(`conteudos/${id}`);
}
