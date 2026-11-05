import api from './api';

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

// devolve a sessão em andamento ou null se não houver
export async function buscarSessaoAtiva() {
  try {
    const { data } = await api.get('/sessoes/ativa');
    return data ? deApi(data) : null;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

export async function criarSessao({ nome, fim }) {
  const { data } = await api.post('/sessoes', { nome, fim: new Date(fim).toISOString() });
  return deApi(data);
}

export async function atualizarSessao(id, patch) {
  const corpo = { ...patch };
  if (corpo.fim != null) corpo.fim = new Date(corpo.fim).toISOString();
  const { data } = await api.patch(`/sessoes/${id}`, corpo);
  return deApi(data);
}

export async function removerSessao(id) {
  await api.delete(`/sessoes/${id}`);
}
