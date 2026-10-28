import { useCallback, useEffect, useMemo, useState } from 'react';
import api, { definirToken } from '../services/api';
import { perfil } from '../services/authService';
import { AuthContext } from './AuthContext';

// Sessão só em memória: recarregar a página desloga. O backend resolve isso depois.
export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const entrar = useCallback((novoToken, usuario = null) => {
    definirToken(novoToken); // já vale para a próxima requisição, antes do re-render
    setToken(novoToken);
    setUser(usuario);
  }, []);

  const sair = useCallback(() => {
    localStorage.removeItem('token');
    definirToken(null);
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
