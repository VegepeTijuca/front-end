import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';
import useAuth from '../hooks/useAuth';

export default function AppLayout() {
  const { user, sair } = useAuth();

  const [menuAberto, setMenuAberto] = useState(false);
  const fecharMenu = useCallback(() => setMenuAberto(false), []);

  return (
    <div className="flex min-h-screen bg-white font-['Nunito',sans-serif]">
      <Navbar aberto={menuAberto} onFechar={fecharMenu} />
      {menuAberto && (
        <button
          type="button"
          onClick={fecharMenu}
          aria-label="Fechar menu"
          className="fixed left-[calc(min(18rem,85vw)-3rem)] top-4 z-50 rounded-lg p-2 text-white hover:bg-white/10 lg:hidden"
        >
          <span aria-hidden="true">✕</span>
        </button>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} onAbrirMenu={() => setMenuAberto(true)} onSair={sair} />
        <div className="flex-1 bg-[#F4F6FA]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}