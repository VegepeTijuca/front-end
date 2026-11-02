import api from './api';

import { USE_MOCK, erroApi } from './mock';
import { USUARIO_VISITANTE, ehVisitante } from './visitante';


export async function login(credenciais) {
  const { data } = await api.post('login', credenciais);
  localStorage.setItem('token', data.token);
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
}

export async function registrar(dados) {
  const { data } = await api.post('users', dados);
  return data;
}

export async function perfil() {
  if (ehVisitante()) return USUARIO_VISITANTE;

  const usuarioSalvo = localStorage.getItem('user');
  if (usuarioSalvo) {
    return JSON.parse(usuarioSalvo);
  }

  if (USE_MOCK) {
    // em memória o usuário já chega junto com o login; nada a buscar
    throw erroApi('Sem backend: perfil indisponível.', 404);
  }

  const { data } = await api.get('/auth/me');
  return data;
}

export async function listaUsuarios() {
  // console.log("aqui",api.post);
  const { data } = await api.get('users');
  return data;
}

