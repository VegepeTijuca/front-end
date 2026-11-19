import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';
import TourInicial, { chaveTour } from './TourInicial';
import useAuth from '../hooks/useAuth';
import { idDoToken } from '../services/token';

const DESKTOP = '(min-width: 1024px)';

// Sem localStorage não dá para lembrar: nesse caso não mostra o tour, para não repetir sempre.
function tourJaVisto(idUsuario) {
  try {
    return localStorage.getItem(chaveTour(idUsuario)) === '1';
  } catch {
    return true;
  }
}

export default function AppLayout() {
  const { user, token, sair } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // um único estado para o menu: no desktop é a barra lateral, no celular é a gaveta
  const [navAberto, setNavAberto] = useState(() => window.matchMedia(DESKTOP).matches);
  // Tour de boas-vindas: abre sozinho no primeiro acesso de cada usuário.
  // O id sai do token e só abre depois de o usuário carregar (antes abria com a tela ainda vazia).
  const idUsuario = idDoToken(token);
  const [tourFechadoPara, setTourFechadoPara] = useState(null); // id de quem fechou nesta sessão
  const tourAberto =
    Boolean(user) && idUsuario != null && tourFechadoPara !== idUsuario && !tourJaVisto(idUsuario);
  const fecharTour = useCallback(() => {
    setTourFechadoPara(idUsuario);
    try {
      localStorage.setItem(chaveTour(idUsuario), '1');
    } catch {
      /* sem localStorage: só vale até recarregar a página */
    }
  }, [idUsuario]);

  const fecharNav = useCallback(() => setNavAberto(false), []);
  const alternarNav = useCallback(() => setNavAberto((aberto) => !aberto), []);

  // ao cruzar o breakpoint: aberto no desktop, fechado no celular
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const aoMudar = (e) => setNavAberto(e.matches);
    mq.addEventListener('change', aoMudar);
    return () => mq.removeEventListener('change', aoMudar);
  }, []);

  const handleSair = () => {
    sair();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-white font-['Nunito',sans-serif]">
      <Navbar aberto={navAberto} onFechar={fecharNav} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={user}
          navAberto={navAberto}
          onAlternarMenu={alternarNav}
          onSair={handleSair}
        />
        <div className="flex-1 bg-[#F4F6FA]">
          {/* key = rota: a cada página nova o conteúdo entra com uma animação suave */}
          <div key={location.pathname} className="animate-fade-up">
            <Outlet />
          </div>
        </div>
      </div>
      {tourAberto && <TourInicial onFechar={fecharTour} />}
    </div>
  );
}
