// Único dado guardado no navegador: o token de login (precisa sobreviver ao F5).
// O usuário em si NÃO é guardado aqui: é buscado na API.
const CHAVE = 'token';

export function lerToken() {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

export function gravarToken(token) {
  try {
    if (token) localStorage.setItem(CHAVE, token);
    else localStorage.removeItem(CHAVE);
  } catch {
    /* sem localStorage: o login vale só até recarregar */
  }
}

// Lê o id do usuário de dentro do JWT (campos comuns: id, userId, sub).
export function idDoToken(token = lerToken()) {
  if (!token) return null;
  try {
    const parte = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(parte)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    const p = JSON.parse(json);
    return p.id ?? p.userId ?? p.sub ?? null;
  } catch {
    return null;
  }
}
