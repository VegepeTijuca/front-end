import api from './api';
import { USE_MOCK, atraso } from './mock';
import { ehVisitante, gravarLocal, lerLocal, novoIdLocal } from './visitante';

// AJUSTE AQUI: de/para entre o backend e o formato usado na tela.
// fim: ISO no backend, milissegundos na tela. restante: milissegundos.
function deApi(s) {
  return {
    id: s.id ?? s._id,
    nome: s.nome,
    fim: s.fim ? new Date(s.fim).getTime() : null,
    pausado: Boolean(s.pausado),
    restante: Number(s.restante ?? 0),
  };
}

// --- dados locais (sem backend, ou no modo visitante) ---
// guardados já no formato da tela (fim em milissegundos)
const usaLocal = () => USE_MOCK || ehVisitante();
const lerSessao = () => lerLocal('sessao', () => null);

// devolve a sessão em andamento ou null se não houver
export async function buscarSessaoAtiva() {
  if (usaLocal()) {
    await atraso(100);
    const sessao = lerSessao();
    return sessao ? { ...sessao } : null;
  }

  try {
    const { data } = await api.get('/sessoes/ativa');
    return data ? deApi(data) : null;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

export async function criarSessao({ nome, fim }) {
  if (usaLocal()) {
    await atraso(100);
    const sessao = { id: novoIdLocal(), nome, fim, pausado: false, restante: 0 };
    gravarLocal('sessao', sessao);
    return { ...sessao };
  }

  const { data } = await api.post('/sessoes', { nome, fim: new Date(fim).toISOString() });
  return deApi(data);
}

export async function atualizarSessao(id, patch) {
  if (usaLocal()) {
    await atraso(100);
    let sessao = lerSessao();
    if (sessao?.id === id) {
      sessao = { ...sessao, ...patch };
      gravarLocal('sessao', sessao);
    }
    return sessao ? { ...sessao } : null;
  }

  const corpo = { ...patch };
  if (corpo.fim != null) corpo.fim = new Date(corpo.fim).toISOString();
  const { data } = await api.patch(`/sessoes/${id}`, corpo);
  return deApi(data);
}

export async function removerSessao(id) {
  if (usaLocal()) {
    await atraso(100);
    if (lerSessao()?.id === id) gravarLocal('sessao', null);
    return;
  }

  await api.delete(`/sessoes/${id}`);
}
