import api from './api';
import { USE_MOCK, atraso } from './mock';
import { ehVisitante, gravarLocal, lerLocal, novoIdLocal } from './visitante';
import { criarDisciplinas, getListaDisciplinas } from './disciplinaService';
import { criarConteudos } from './conteudoService';

// --- timers salvos (presets do usuário) ---
// { id, nome, foco (minutos), pausa (minutos, 0 = sem pausa), padrao }

function deApi(t) {
  return {
    id: t.id ?? t._id,
    nome: t.nome,
    foco: Number(t.foco),
    pausa: Number(t.pausa ?? 0),
    padrao: Boolean(t.padrao),
  };
}

const usaLocal = () => USE_MOCK || ehVisitante();
const lerTimers = () => lerLocal('timers-salvos', () => []);

export async function listarTimers() {
  if (usaLocal()) {
    await atraso(80);
    return lerTimers();
  }
  const { data } = await api.get('/presets-timer');
  return data.map(deApi);
}

export async function criarTimer({ nome, foco, pausa = 0 }) {
  if (usaLocal()) {
    await atraso(80);
    const lista = lerTimers();
    const novo = { id: novoIdLocal(), nome, foco, pausa, padrao: lista.length === 0 };
    gravarLocal('timers-salvos', [...lista, novo]);
    return { ...novo };
  }
  const { data } = await api.post('/presets-timer', { nome, foco, pausa });
  return deApi(data);
}

export async function removerTimer(id) {
  if (usaLocal()) {
    await atraso(80);
    gravarLocal('timers-salvos', lerTimers().filter((t) => t.id !== id));
    return;
  }
  await api.delete(`/presets-timer/${id}`);
}

// marca um timer como o padrão (o back deve desmarcar os outros do mesmo usuário)
export async function definirTimerPadrao(id) {
  if (usaLocal()) {
    await atraso(80);
    gravarLocal('timers-salvos', lerTimers().map((t) => ({ ...t, padrao: t.id === id })));
    return;
  }
  await api.patch(`/presets-timer/${id}`, { padrao: true });
}

// --- matérias prontas ---
// Cria no app as disciplinas e conteúdos de um pacote (usa as mesmas rotas da tela Disciplinas).
// Disciplinas que já existem (mesmo nome) são puladas. Devolve quantas foram criadas.
export async function adicionarPacote(pacote) {
  const existentes = (await getListaDisciplinas()).map((d) => d.name.trim().toLowerCase());
  let criadas = 0;

  for (const materia of pacote.materias) {
    if (existentes.includes(materia.nome.toLowerCase())) continue;
    const disciplina = await criarDisciplinas({ name: materia.nome, descricao: '' });
    const id = disciplina.id ?? disciplina._id;
    for (const conteudo of materia.conteudos) {
      await criarConteudos({ name: conteudo, descricao: '', disciplinaId: id });
    }
    criadas += 1;
  }
  return criadas;
}
