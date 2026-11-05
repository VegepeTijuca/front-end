import api from './api';
import { idDoToken } from './token';

const ROTA = 'timers';

// ---------- timer personalizados ----------

const chavePadrao = () => `classme:timer-padrao:${idDoToken() ?? 'anonimo'}`;

function lerPadrao() {
  try {
    return localStorage.getItem(chavePadrao());
  } catch {
    return null;
  }
}

function gravarPadrao(id) {
  try {
    if (id != null) localStorage.setItem(chavePadrao(), String(id));
    else localStorage.removeItem(chavePadrao());
  } catch {
    /* sem localStorage: o padrão vale só até recarregar */
  }
}

function deApi(t) {
  const id = t.id ?? t._id;
  return {
    id,
    nome: t.name,
    foco: Number(t.tempo_ativo),
    pausa: Number(t.tempo_pausa ?? 0),
    padrao: lerPadrao() === String(id),
  };
}

export async function listarTimers() {
  const { data } = await api.get(ROTA);
  return data.map(deApi);
}

export async function criarTimer({ nome, foco, pausa = 0 }) {
  const { data } = await api.post(ROTA, {
    name: nome,
    tempo_ativo: foco,
    tempo_pausa: pausa,
  });
  return deApi(data);
}

export async function removerTimer(id) {
  await api.delete(`${ROTA}/${id}`);
  if (lerPadrao() === String(id)) gravarPadrao(null);
}

export async function definirTimerPadrao(id) {
  gravarPadrao(id);
}

// ---------- sessão em andamento ----------

const chaveSessao = () => `classme:sessao-ativa:${idDoToken() ?? 'anonimo'}`;

function lerSessao() {
  try {
    const bruto = localStorage.getItem(chaveSessao());
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

function gravarSessao(sessao) {
  try {
    if (sessao) localStorage.setItem(chaveSessao(), JSON.stringify(sessao));
    else localStorage.removeItem(chaveSessao());
  } catch {
    /* sem localStorage: a sessão vale só até recarregar a página */
  }
}

// devolve a sessão em andamento ou null se não houver
export async function buscarSessaoAtiva() {
  const s = lerSessao();
  if (!s) return null;
  return {
    id: s.id,
    nome: s.nome,
    fim: s.fim ?? null,
    pausado: Boolean(s.pausado),
    restante: Number(s.restante ?? 0),
  };
}

export async function criarSessao({ nome, fim }) {
  const sessao = { id: String(Date.now()), nome, fim, pausado: false, restante: 0 };
  gravarSessao(sessao);
  return sessao;
}

export async function atualizarSessao(id, patch) {
  const atual = lerSessao();
  if (!atual || atual.id !== id) return null;
  gravarSessao({ ...atual, ...patch });
  return null;
}

export async function removerSessao(id) {
  const atual = lerSessao();
  if (atual && atual.id === id) gravarSessao(null);
}
