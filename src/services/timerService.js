import api from './api';
import { USE_MOCK, atraso, novoId } from './mock';

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

// --- dados em memória (só enquanto não há backend) ---
// guarda já no formato da tela (fim em milissegundos)
let sessaoMock = null;

// devolve a sessão em andamento ou null se não houver
export async function buscarSessaoAtiva() {
  if (USE_MOCK) {
    await atraso(100);
    return sessaoMock ? { ...sessaoMock } : null;
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
  if (USE_MOCK) {
    await atraso(100);
    sessaoMock = { id: novoId(), nome, fim, pausado: false, restante: 0 };
    return { ...sessaoMock };
  }

  const { data } = await api.post('/sessoes', { nome, fim: new Date(fim).toISOString() });
  return deApi(data);
}

export async function atualizarSessao(id, patch) {
  if (USE_MOCK) {
    await atraso(100);
    if (sessaoMock?.id === id) sessaoMock = { ...sessaoMock, ...patch };
    return sessaoMock ? { ...sessaoMock } : null;
  }

  const corpo = { ...patch };
  if (corpo.fim != null) corpo.fim = new Date(corpo.fim).toISOString();
  const { data } = await api.patch(`/sessoes/${id}`, corpo);
  return deApi(data);
}

export async function removerSessao(id) {
  if (USE_MOCK) {
    await atraso(100);
    if (sessaoMock?.id === id) sessaoMock = null;
    return;
  }

  await api.delete(`/sessoes/${id}`);
}
