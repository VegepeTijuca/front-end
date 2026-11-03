import { useCallback, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';
import TourInicial, { CHAVE_TOUR, EVENTO_TOUR } from './TourInicial';
import useAuth from '../hooks/useAuth';

const DESKTOP = '(min-width: 1024px)';

function tourJaVisto() {
  try {
    return localStorage.getItem(CHAVE_TOUR) === '1';
  } catch {
    return true;
  }
}

export default function AppLayout() {
  const { user, visitante, sair } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // um único estado para o menu: no desktop é a barra lateral, no celular é a gaveta
  const [navAberto, setNavAberto] = useState(() => window.matchMedia(DESKTOP).matches);
  // tour de boas-vindas: abre sozinho na primeira visita; o menu do perfil abre de novo
  const [tourAberto, setTourAberto] = useState(() => !tourJaVisto());
  const fecharTour = useCallback(() => {
    setTourAberto(false);
    try {
      localStorage.setItem(CHAVE_TOUR, '1');
    } catch {
      /* sem localStorage: o tour aparece de novo na próxima visita */
    }
  }, []);
  const abrirTour = useCallback(() => setTourAberto(true), []);

  useEffect(() => {
    window.addEventListener(EVENTO_TOUR, abrirTour);
    return () => window.removeEventListener(EVENTO_TOUR, abrirTour);
  }, [abrirTour]);

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
          visitante={visitante}
          navAberto={navAberto}
          onAlternarMenu={alternarNav}
          onSair={handleSair}
          onAbrirTour={abrirTour}
        />
        {visitante && (
          <div role="status" className="bg-tj-orange/20 px-6 py-2 text-center text-sm text-[#6b3b02] md:px-12">
            Você está no <strong>modo visitante</strong>: os dados ficam só neste navegador.{' '}
            <Link to="/cadastro" className="font-semibold underline">
              Criar conta
            </Link>
          </div>
        )}
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
