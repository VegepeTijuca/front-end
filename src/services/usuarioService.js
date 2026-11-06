import api from './api';

// AJUSTE AQUI a rota conforme o seu backend.
// respostas: { area, areaOutro?, objetivo, estilo, tempo, periodo }
export async function salvarPreferencias(respostas) {
  const { data } = await api.put('usuarios/me/preferencias', respostas);
  return data;
}

// Preferências já salvas. Se a rota não existir ainda, devolve {}.
export async function lerPreferencias() {
  try {
    const { data } = await api.get('usuarios/me/preferencias');
    return data ?? {};
  } catch {
    return {};
  }
}
