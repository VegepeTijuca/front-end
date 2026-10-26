import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import classmeLogo from '../assets/classme.svg';

const mainItems = [
  { label: 'Início', to: '/', end: true },
  { label: 'Visão Geral', to: '/dashboard' },
  { label: 'Disciplinas', to: '/disciplinas' },
  { label: 'Simulados', to: '/simulados' },
];

const siteItems = [
  { label: 'Configurações', to: '/configuracoes' },
  { label: 'Sobre', to: '/sobre' },
];

// links só para desenvolvimento: somem no build de produção
const devItems = import.meta.env.DEV
  ? [
      { label: 'Login', to: '/login' },
      { label: 'Cadastro', to: '/cadastro' },
      { label: 'Setup do usuário', to: '/setup-usuario' },
    ]
  : [];

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

        {devItems.length > 0 && (
          <div className="mt-6 space-y-2 border-t border-dashed border-amber-400/40 pt-6">
            <p className="px-4 text-xs font-bold uppercase tracking-wide text-amber-300">Dev</p>
            {devItems.map((item) => (
              <NavItem key={item.to} {...item} onClick={onNavegar} />
            ))}
          </div>
        )}
      </nav>
    </>
  );
}

// O estado (aberto/fechado) vive no AppLayout; o botão de alternar fica no Header.
export default function Navbar({ aberto, onFechar }) {
  // Esc fecha a gaveta (só no celular; no desktop a barra é parte da página)
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && !window.matchMedia('(min-width: 1024px)').matches) onFechar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <>
      {/* desktop: barra lateral */}
      <aside
        id="navegacao-lateral"
        className="hidden w-72 shrink-0 overflow-y-auto bg-navy p-6 text-white lg:flex lg:flex-col"
      >
        <Conteudo />
      </aside>

      {/* celular: gaveta */}
      <div className="fixed inset-0 z-40 lg:hidden">
        <div className="absolute inset-0 bg-slate-900/50" onClick={onFechar} aria-hidden="true" />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-navy p-6 text-white shadow-2xl"
        >
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar menu"
            className="mb-4 self-end rounded-lg p-2 text-white hover:bg-white/10"
          >
            <span aria-hidden="true">✕</span>
          </button>
          <Conteudo onNavegar={onFechar} />
        </aside>
      </div>
    </>
  );
}
