import api from './api';
import { USE_MOCK, atraso } from './mock';
import { ehVisitante, gravarLocal } from './visitante';

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
