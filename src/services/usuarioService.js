import api from './api';
import { USE_MOCK, atraso } from './mock';
import { ehVisitante, gravarLocal, lerLocal } from './visitante';

// AJUSTE AQUI a rota conforme o seu backend.
// respostas: { area, estilo, tempo, areaOutro? }
export async function salvarPreferencias(respostas) {
  if (USE_MOCK || ehVisitante()) {
    await atraso();
    gravarLocal('preferencias', respostas);
    return { ...respostas };
  }

  const { data } = await api.put('/usuarios/me/preferencias', respostas);
  return data;
}

// Preferências já salvas (as que a API guarda). Sem back, ou se a rota falhar, devolve {}.
export async function lerPreferencias() {
  if (USE_MOCK || ehVisitante()) {
    await atraso(50);
    return lerLocal('preferencias', () => ({}));
  }
  try {
    const { data } = await api.get('/usuarios/me/preferencias');
    return data ?? {};
  } catch {
    return {};
  }
}
