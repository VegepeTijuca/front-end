import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function EntradaVisitante() {
  const { entrarVisitante } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    entrarVisitante();
    navigate('/dashboard', { replace: true });
  }, [entrarVisitante, navigate]);

  return null;
}
