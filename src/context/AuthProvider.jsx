import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { perfil } from '../services/authService';
import { gravarToken, lerToken } from '../services/token';
import { AuthContext } from './AuthContext';

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(lerToken);
  const [user, setUser] = useState(null);

  const entrar = useCallback((novoToken, usuario = null) => {
    gravarToken(novoToken);
    setToken(novoToken);
    setUser(usuario);
  }, []);

  const sair = useCallback(() => {
    gravarToken(null);
    setToken(null);
    setUser(null);
  }, []);

  // 401 fora do login/cadastro = token inválido ou expirado: desloga
  useEffect(() => {
    const id = api.interceptors.response.use(
      (resposta) => resposta,
      (err) => {
        const url = err.config?.url ?? '';
        const ehAuth = /^\/?(login|users)(\/|$)/.test(url) && err.config?.method !== 'get';
        if (err.response?.status === 401 && !ehAuth) sair();
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, [sair]);

  // tem token (ex.: depois de um F5) mas ainda não temos o usuário: busca na API
  useEffect(() => {
    if (!token || user) return;
    let cancelado = false;
    perfil()
      .then((dados) => {
        if (!cancelado && dados) setUser(dados);
      })
      .catch(() => {
        /* 401 já desloga pelo interceptor */
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
