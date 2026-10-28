import api from './api';

import { USE_MOCK, erroApi} from './mock';


export async function login(credenciais) {
  const { data } = await api.post('login', credenciais);
  localStorage.setItem('token', data.token);
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
}

export async function registrar(dados) {
    
  console.log(dados)

  const { data } = await api.post('users', dados);

  console.log(data)




  // if (USE_MOCK) {
  //   await atraso();
  //   const username = String(dados.username ?? '').trim();
  //   const email = String(dados.email ?? '').trim();

  //   if (usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
  //     throw erroApi('Este e-mail já está cadastrado.', 409);
  //   }
  //   if (usuarios.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
  //     throw erroApi('Este nome de usuário já está em uso.', 409);
  //   }

  //   const usuario = { id: novoId(), username, email, password: dados.password };
  //   usuarios.push(usuario);
  //   return sessaoDe(usuario);
  // }

  // const { data } = await api.post('/auth/register', dados);
  // return data;
}

export async function perfil() {
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

