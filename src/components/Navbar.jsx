import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import classmeLogo from '../assets/classme.svg';

const mainItems = [
  { label: 'Início', to: '/', end: true },
  { label: 'Visão Geral', to: '/dashboard' },
  { label: 'Disciplinas', to: '/disciplinas' },
  { label: 'Simulados', to: '/simulados' },
  { label: 'Login', to: '/login' },
  { label: 'Cadastro', to: '/Cadastro' },
];

const siteItems = [
  { label: 'Configurações', to: '/configuracoes' },
  { label: 'Sobre', to: '/sobre' },
];

function NavItem({ label, to, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
          isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function Conteudo({ onNavegar }) {
  return (
    <>
      <NavLink
        to="/"
        onClick={onNavegar}
        aria-label="Classme, ir para o início"
        className="mb-6 flex w-full items-center justify-center gap-3"
      >
        <img src={classmeLogo} alt="Classme" className="h-20 w-auto" />
      </NavLink>

      <nav aria-label="Navegação principal" className="flex flex-1 flex-col">
        <div className="space-y-2">
          {mainItems.map((item) => (
            <NavItem key={item.to} {...item} onClick={onNavegar} />
          ))}
        </div>

        <div className="mt-6 space-y-2 border-t border-white/10 pt-6">
          {siteItems.map((item) => (
            <NavItem key={item.to} {...item} onClick={onNavegar} />
          ))}
        </div>
      </nav>
    </>
  );
}

export default function Navbar({ aberto = false, onFechar = () => {}, onAbrir = () => {} }) {
  const [menuInterno, setMenuInterno] = useState(false);
  const menuAberto = aberto || menuInterno;

  const fecharMenu = () => {
    setMenuInterno(false);
    onFechar();
  };

  const abrirMenu = () => {
    setMenuInterno(true);
    onAbrir();
  };

  useEffect(() => {
    if (!menuAberto) return;
    const onKey = (e) => e.key === 'Escape' && fecharMenu();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuAberto, onFechar]);

  return (
    <>
      {!menuAberto && (
        <button
          type="button"
          onClick={abrirMenu}
          aria-label="Abrir menu"
          className="fixed left-4 top-4 z-30 rounded-lg bg-navy p-3 text-white lg:hidden"
        >
          <span aria-hidden="true">☰</span>
        </button>
      )}

      {/* desktop: barra lateral fixa */}
      <aside className="hidden w-72 shrink-0 overflow-y-auto bg-navy p-6 text-white lg:flex lg:flex-col">
        <Conteudo />
      </aside>

      {/* celular: gaveta */}
      {menuAberto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={fecharMenu} aria-hidden="true" />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-navy p-6 text-white shadow-2xl"
          >
            <button
              type="button"
              onClick={fecharMenu}
              aria-label="Fechar menu"
              className="mb-4 self-end rounded-lg p-2 text-white hover:bg-white/10"
            >
              <span aria-hidden="true">✕</span>
            </button>
            <Conteudo onNavegar={fecharMenu} />
          </aside>
        </div>
      )}
    </>
  );
}