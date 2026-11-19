import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Calendar, House, Info } from 'lucide-react';

import useMediaQuery from '../hooks/useMediaQuery';

const DESKTOP_QUERY = '(min-width: 1024px)';

const mainItems = [
  {
    label: 'Visão Geral',
    Icone: House,
    to: '/dashboard',
    dica: 'Resumo do dia, calendário, temporizador e tarefas',
  },
  {
    label: 'Calendário',
    Icone: Calendar,
    to: '/calendario',
    dica: 'Visualização completa do calendário',
  },
  {
    label: 'Disciplinas',
    Icone: BookOpen,
    to: '/disciplinas',
    dica: 'Disciplinas e conteúdos de estudo',
  },
];

const siteItems = [
  {
    label: 'Sobre',
    Icone: Info,
    to: '/sobre',
    dica: 'Conheça o CLɅSS.ME',
  },
];

function NavItem({ label, Icone, to, dica, end, onClick, compacto }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      title={dica ?? label}
      className={({ isActive }) =>
        `relative flex w-full cursor-pointer items-center rounded-2xl px-3.5 py-2.5 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/60 ${
          isActive
            ? 'bg-white/10 text-white ring-1 ring-white/15'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              aria-hidden="true"
              className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-tj-blue"
            />
          )}

          {Icone && <Icone className="h-5 w-5 shrink-0" />}

          <span
            className={`overflow-hidden whitespace-nowrap transition-[max-width,margin,opacity] duration-300 ${
              compacto
                ? 'ml-0 max-w-0 opacity-0'
                : 'ml-3 max-w-48 opacity-100 delay-100'
            }`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

function Logo({ compacto }) {
  return (
    <span className="relative block h-full w-full">
      <span
        aria-hidden="true"
        className={`absolute inset-0 grid place-items-center transition-opacity duration-300 ${
          compacto ? 'opacity-100 delay-100' : 'opacity-0'
        }`}
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-3xl font-bold leading-none text-blue-500">
          Ʌ
        </span>
      </span>

      <span
        className={`absolute inset-0 flex items-center justify-center whitespace-nowrap text-4xl font-extrabold tracking-tight text-blue-500 transition-opacity duration-300 ${
          compacto ? 'opacity-0' : 'opacity-100 delay-100'
        }`}
      >
        CL<span className="font-bold">Ʌ</span>SS.ME
      </span>
    </span>
  );
}

function Conteudo({ onNavegar, compacto = false }) {
  return (
    <>
      <NavLink
        to="/dashboard"
        onClick={onNavegar}
        aria-label="CLɅSS.ME — ir para o painel"
        className="mb-6 block h-20 w-full shrink-0 cursor-pointer"
      >
        <Logo compacto={compacto} />
      </NavLink>

      <nav aria-label="Navegação principal" className="flex flex-1 flex-col">
        <div className="space-y-2">
          {mainItems.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              onClick={onNavegar}
              compacto={compacto}
            />
          ))}
        </div>

        <div className="mt-6 space-y-2 border-t border-white/10 pt-6">
          {siteItems.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              onClick={onNavegar}
              compacto={compacto}
            />
          ))}
        </div>
      </nav>
    </>
  );
}

export default function Navbar({ aberto, onFechar }) {
  const [expandida, setExpandida] = useState(false);
  const desktop = useMediaQuery(DESKTOP_QUERY);

  useEffect(() => {
    if (!aberto || desktop) return undefined;

    const fecharComEscape = (event) => {
      if (event.key === 'Escape') onFechar();
    };

    window.addEventListener('keydown', fecharComEscape);
    return () => window.removeEventListener('keydown', fecharComEscape);
  }, [aberto, desktop, onFechar]);

  useEffect(() => {
    if (!aberto || desktop) return undefined;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflowAnterior;
    };
  }, [aberto, desktop]);

  useEffect(() => {
    if (!aberto) setExpandida(false);
  }, [aberto]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => setExpandida(false)}
        className={`fixed inset-0 z-20 hidden bg-black/50 transition-opacity duration-300 ease-out lg:block ${
          expandida
            ? 'opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Reservado apenas no desktop para o conteúdo não ficar abaixo da barra. */}
      <div className="hidden w-24 shrink-0 lg:block">
        <aside
          id="navegacao-lateral"
          onMouseEnter={() => setExpandida(true)}
          onMouseLeave={() => setExpandida(false)}
          onFocus={() => setExpandida(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setExpandida(false);
            }
          }}
          className={`fixed inset-y-3 left-3 z-30 flex flex-col overflow-x-hidden overflow-y-auto rounded-3xl bg-navy p-3 text-white shadow-2xl shadow-slate-900/30 transition-[width] duration-300 ease-out ${
            expandida ? 'w-72' : 'w-18'
          }`}
        >
          <Conteudo compacto={!expandida} />
        </aside>
      </div>

      <div
        className={`fixed inset-0 z-40 transition-[visibility] duration-300 lg:hidden ${
          aberto ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        <div
          aria-hidden="true"
          onClick={onFechar}
          className={`absolute inset-0 bg-slate-900/50 transition-opacity duration-300 ${
            aberto ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          aria-hidden={!aberto}
          className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-navy p-6 text-white shadow-2xl transition-transform duration-300 ease-out ${
            aberto ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar menu"
            className="mb-4 cursor-pointer self-end rounded-lg p-2 text-white hover:bg-white/10"
          >
            <span aria-hidden="true">✕</span>
          </button>

          <Conteudo onNavegar={onFechar} />
        </aside>
      </div>
    </>
  );
}
