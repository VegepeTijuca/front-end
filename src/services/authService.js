import api from './api';

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

  // if (  ) {
  //   return data.messages
  // }

  return data; 
}

// o token JWT do backend carrega { id } no meio (payload)
function idDoToken() {
  try {
    const token = localStorage.getItem('token');
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload)).id ?? null;
  } catch {
    return null;
  }
}

export async function perfil() {
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