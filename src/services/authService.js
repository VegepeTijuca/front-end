import api from './api';

import { USE_MOCK, erroApi } from './mock';
import { USUARIO_VISITANTE, ehVisitante } from './visitante';


export async function login(credenciais) {
  const { data } = await api.post('login', credenciais);
  localStorage.setItem('token', data.token);
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  console.log( data )
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

  const id = idDoToken();
  if (id == null) return null;

  console.log('Aqui')

  const { data } = await api.get(`users/${id}`);

  console.log('ali')
  localStorage.setItem('user', JSON.stringify(data));
  return data;
}

export async function listaUsuarios() {
  const { data } = await api.get('users');
  return data;
}