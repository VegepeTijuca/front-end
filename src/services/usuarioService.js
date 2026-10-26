import api from './api';

// AJUSTE AQUI a rota conforme o seu backend.
// respostas: { area, estilo, tempo, areaOutro? }
export async function salvarPreferencias(respostas) {
  const { data } = await api.put('/usuarios/me/preferencias', respostas);
  return data;
}
