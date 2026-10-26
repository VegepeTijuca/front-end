import api from './api';

// AJUSTE AQUI as rotas e o formato das respostas conforme o seu backend.
// Esperado: login e registrar devolvem { token, user }.

export async function login(credenciais) {
  const { data } = await api.post('/auth/login', credenciais);
  return data;
}

export async function registrar(dados) {
  const { data } = await api.post('/auth/register', dados);
  return data;
}

export async function perfil() {
  const { data } = await api.get('/auth/me');
  return data;
}
