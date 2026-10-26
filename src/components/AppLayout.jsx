import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';
import useAuth from '../hooks/useAuth';

const DESKTOP = '(min-width: 1024px)';

export default function AppLayout() {
  const { user, sair } = useAuth();
  const navigate = useNavigate();

  // um único estado para o menu: no desktop é a barra lateral, no celular é a gaveta
  const [navAberto, setNavAberto] = useState(() => window.matchMedia(DESKTOP).matches);
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
          <Outlet />
        </div>
      </div>
    </div>
  );
}
