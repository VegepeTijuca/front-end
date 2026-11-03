import api from './api';
import { atraso } from './mock';
import { ehVisitante, gravarLocal, lerLocal, novoIdLocal } from './visitante';

// --- modo visitante: disciplinas e conteúdos de exemplo, guardados no navegador ---
// (os conteúdos ficam em 'conteudos'; o conteudoService usa a mesma chave)
const ID_MATEMATICA = 'local-matematica';
const ID_PORTUGUES = 'local-portugues';
const ID_HISTORIA = 'local-historia';

const disciplinasIniciais = () => [
  { id: ID_MATEMATICA, name: 'Matemática', descricao: 'Álgebra, geometria e funções' },
  { id: ID_PORTUGUES, name: 'Português', descricao: 'Gramática, interpretação e redação' },
  { id: ID_HISTORIA, name: 'História', descricao: 'Brasil e mundo' },
];

export const conteudosIniciais = () => [
  { id: novoIdLocal(), name: 'Equações do 2º grau', descricao: '', disciplinaId: ID_MATEMATICA },
  { id: novoIdLocal(), name: 'Funções', descricao: '', disciplinaId: ID_MATEMATICA },
  { id: novoIdLocal(), name: 'Classes de palavras', descricao: '', disciplinaId: ID_PORTUGUES },
  { id: novoIdLocal(), name: 'Revolução Industrial', descricao: '', disciplinaId: ID_HISTORIA },
];

const lerDisciplinas = () => lerLocal('disciplinas', disciplinasIniciais);

export async function criarDisciplinas(dados) {
  if (ehVisitante()) {
    await atraso(100);
    const nova = { id: novoIdLocal(), name: dados.name, descricao: dados.descricao ?? '' };
    gravarLocal('disciplinas', [...lerDisciplinas(), nova]);
    return nova;
  }

  const { data } = await api.post('disciplinas', dados);
  return data;
}

export async function getListaDisciplinas() {
  if (ehVisitante()) {
    await atraso(100);
    return lerDisciplinas();
  }

  const { data } = await api.get('disciplinas');
  return data;
}

// AJUSTE AQUI: rota de edição conforme o seu backend (ainda não testada).
export async function atualizarDisciplina(id, dados) {
  if (ehVisitante()) {
    await atraso(100);
    const lista = lerDisciplinas().map((d) => (d.id === id ? { ...d, ...dados } : d));
    gravarLocal('disciplinas', lista);
    return lista.find((d) => d.id === id);
  }

  const { data } = await api.put(`disciplinas/${id}`, dados);
  return data;
}

// AJUSTE AQUI: rota de exclusão conforme o seu backend (ainda não testada).
export async function removerDisciplina(id) {
  if (ehVisitante()) {
    await atraso(100);
    gravarLocal('disciplinas', lerDisciplinas().filter((d) => d.id !== id));
    // apaga também os conteúdos dessa disciplina
    const conteudos = lerLocal('conteudos', conteudosIniciais);
    gravarLocal('conteudos', conteudos.filter((c) => c.disciplinaId !== id));
    return;
  }

  await api.delete(`disciplinas/${id}`);
}
