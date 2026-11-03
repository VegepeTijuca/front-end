import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api'; // Não precisa mais do definirToken
import { perfil } from '../services/authService';
import { AuthContext } from './AuthContext';

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // Define a função de entrar salvando o token no localStorage
  const entrar = useCallback((novoToken, usuario = null) => {
    localStorage.setItem('token', novoToken); // Fix: Agora persiste no F5
    setToken(novoToken);
    setUser(usuario);
  }, []);

  const sair = useCallback(() => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setToken(null);
  setUser(null);
}, []);

  useEffect(() => {
    const id = api.interceptors.response.use(
      (resposta) => resposta,
      (err) => {
        const url = err.config?.url ?? '';
        const ehAuth = url.startsWith('login') || url.startsWith('users');
        if (err.response?.status === 401 && !ehAuth) {
          sair();
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, [sair]);

  // Busca o perfil do usuário caso exista token mas os dados ainda não foram carregados
  useEffect(() => {
    if (!token || user) return;

    let cancelado = false;
    perfil()
      .then((dados) => {
        if (!cancelado) setUser(dados);
      })
      .catch(() => {
        // O interceptor de resposta já cuida do 401 deslogando o usuário
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
