import api from './api';
import { USE_MOCK, atraso, erroApi, novoId } from './mock';

// AJUSTE AQUI as rotas e o formato das respostas conforme o seu backend.
// Esperado: login e registrar devolvem { token, user }.

// --- dados em memória (só enquanto não há backend) ---
// usuário de teste: login "demo" / senha "demo"
const usuarios = [
  { id: 'u-demo', username: 'demo', email: 'demo@classme.dev', password: 'demo' },
];

function sessaoDe(usuario) {
  const { password, ...publico } = usuario; // eslint-disable-line no-unused-vars
  return { token: `mock-token-${usuario.id}`, user: { ...publico, name: usuario.username } };
}

export async function login(credenciais) {
  if (USE_MOCK) {
    await atraso();
    const alvo = String(credenciais.usuario ?? '').trim().toLowerCase();
    const usuario = usuarios.find(
      (u) =>
        (u.username.toLowerCase() === alvo || u.email.toLowerCase() === alvo) &&
        u.password === credenciais.password
    );
    if (!usuario) throw erroApi('Usuário ou senha inválidos.', 401);
    return sessaoDe(usuario);
  }

  const { data } = await api.post('/auth/login', credenciais);
  return data;
}

export async function registrar(dados) {
  if (USE_MOCK) {
    await atraso();
    const username = String(dados.username ?? '').trim();
    const email = String(dados.email ?? '').trim();

    if (usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw erroApi('Este e-mail já está cadastrado.', 409);
    }
    if (usuarios.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      throw erroApi('Este nome de usuário já está em uso.', 409);
    }

    const usuario = { id: novoId(), username, email, password: dados.password };
    usuarios.push(usuario);
    return sessaoDe(usuario);
  }

  const { data } = await api.post('/auth/register', dados);
  return data;
}

export async function perfil() {
  if (USE_MOCK) {
    // em memória o usuário já chega junto com o login; nada a buscar
    throw erroApi('Sem backend: perfil indisponível.', 404);
  }

  const { data } = await api.get('/auth/me');
  return data;
}
