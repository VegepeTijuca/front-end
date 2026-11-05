import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Login e cadastro: quem já está logado vai direto para o dashboard.
export default function RotaPublica() {
  const { autenticado } = useAuth();
  return autenticado ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
