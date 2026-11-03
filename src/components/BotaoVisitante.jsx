import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { PERMITIR_VISITANTE } from '../services/visitante';

// Botão "entrar sem conta". Some sozinho se PERMITIR_VISITANTE for false (services/visitante.js).
// "className" deixa cada tela escolher o visual do botão.
export default function BotaoVisitante({ className = '', children = 'Entrar sem conta' }) {
  const { entrarVisitante } = useAuth();
  const navigate = useNavigate();

  if (!PERMITIR_VISITANTE) return null;

  function entrar() {
    entrarVisitante();
    navigate('/dashboard');
  }

  return (
    <button type="button" onClick={entrar} className={className}>
      {children}
    </button>
  );
}
