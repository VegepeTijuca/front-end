import api from './api';
import { gravarToken, idDoToken } from './token';

// POST /login -> { token, user? }. Guarda só o token.
export async function login(credenciais) {

  console.log('login', credenciais);

  const { data } = await api.post('login', credenciais);
  if (!data?.token) throw new Error('A API não devolveu o token no login.');

  console.log('passou');
  gravarToken(data.token);
  return data;
}

// POST /users -> usuário criado (pode ou não devolver token)
export async function registrar(dados) {
  const { data } = await api.post('users', dados);
  return data;
}

// Usuário logado, sempre vindo da API (nada fica salvo no navegador).
export async function perfil() {
  const id = idDoToken();
  if (id == null) return null;
  const { data } = await api.get(`users/${id}`);
  return data?.user ?? data;
}

export async function listaUsuarios() {
  const { data } = await api.get('users');
  return data;
}
