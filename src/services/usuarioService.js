import api from './api';
import { USE_MOCK, atraso } from './mock';

// AJUSTE AQUI a rota conforme o seu backend.
// respostas: { area, estilo, tempo, areaOutro? }
let preferenciasMock = null;

export async function salvarPreferencias(respostas) {
  if (USE_MOCK) {
    await atraso();
    preferenciasMock = { ...respostas };
    return { ...preferenciasMock };
  }

  const { data } = await api.put('/usuarios/me/preferencias', respostas);
  return data;
}
