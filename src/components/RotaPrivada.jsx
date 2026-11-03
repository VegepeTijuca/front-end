import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Enquanto a API não está disponível, deixe true para navegar pelas telas em desenvolvimento
// sem precisar logar. Troque para false para testar a proteção de verdade.
// (No build de produção a proteção sempre fica ligada.)
const PULAR_GUARDA_EM_DEV = true;

export default function RotaPrivada() {
  const { autenticado } = useAuth();
  const location = useLocation();

  if (!autenticado && !(import.meta.env.DEV && PULAR_GUARDA_EM_DEV)) {
    return <Navigate to="/login" replace state={{ de: location.pathname }} />;
  }

  return <Outlet />;
}
