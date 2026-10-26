import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { perfil } from '../services/authService';
import { AuthContext } from './AuthContext';

// O token é o único dado guardado no navegador (os dados do app vêm do backend).
const TOKEN_KEY = 'token';

function lerToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(lerToken);
  const [user, setUser] = useState(null);

  const entrar = useCallback((novoToken, usuario = null) => {
    try {
      localStorage.setItem(TOKEN_KEY, novoToken);
    } catch {
      /* armazenamento indisponível: a sessão vale só até recarregar */
    }
    setToken(novoToken);
    setUser(usuario);
  }, []);

  const sair = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* nada a fazer */
    }
    setToken(null);
    setUser(null);
  }, []);

  // sessão expirada: qualquer 401 (fora do login e do cadastro) desloga
  useEffect(() => {
    const id = api.interceptors.response.use(
      (resposta) => resposta,
      (err) => {
        const url = err.config?.url ?? '';
        const ehAuth = url.startsWith('/auth/login') || url.startsWith('/auth/register');
        if (err.response?.status === 401 && !ehAuth) sair();
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, [sair]);

  // com token e sem dados do usuário, busca o perfil
  useEffect(() => {
    if (!token || user) return;

    let cancelado = false;
    perfil()
      .then((dados) => {
        if (!cancelado) setUser(dados);
      })
      .catch(() => {
        /* o 401 já é tratado pelo interceptor; outros erros: segue sem o perfil */
      });

    return () => {
      cancelado = true;
    };
  }, [token, user]);

  const value = useMemo(
    () => ({ token, user, autenticado: Boolean(token), entrar, sair }),
    [token, user, entrar, sair]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
