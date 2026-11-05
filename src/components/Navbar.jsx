import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
// Ícones utilizados nos links da navegação.
import {
  Calendar,
  Info,
  BookOpen,
  House,
  Globe,
  LogIn,
  UserPlus,
  UserCog,
  FlaskConical,
} from 'lucide-react';

// Itens principais exibidos na navegação lateral.
const mainItems = [
  { label: 'Visão Geral', Icone: House, to: '/dashboard', dica: 'Resumo do dia, calendário, timer e tarefas' },
  { label: 'Calendário', Icone: Calendar, to: '/calendario', dica: 'Calendário em tela cheia' },
  { label: 'Disciplinas', Icone: BookOpen, to: '/disciplinas', dica: 'Matérias e conteúdos' },
];

// Itens institucionais da navegação.
const siteItems = [{ label: 'Sobre', Icone: Info, to: '/sobre', dica: 'Sobre o clʌss.me' }];

// links só para desenvolvimento: somem no build de produção
// (ganharam ícones porque, com a barra recolhida, só os ícones aparecem)
const devItems = import.meta.env.DEV
  ? [
      { label: 'Landing page', Icone: Globe, to: '/' },
      { label: 'Login', Icone: LogIn, to: '/login' },
      { label: 'Cadastro', Icone: UserPlus, to: '/cadastro' },
      { label: 'Setup do usuário', Icone: UserCog, to: '/setup-usuario' },
      { label: 'TesteComponents', Icone: FlaskConical, to: '/testeComponents' },
    ]
  : [];

// Renderiza um link de navegação com ícone, texto e indicador de página ativa.
// No modo compacto, apenas o ícone fica visível.
function NavItem({ label, Icone, to, dica, end, onClick, compacto }) {
  return (
    // NavLink aplica o estilo ativo de acordo com a rota atual.
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      title={dica ?? label}
      className={({ isActive }) =>
        `relative flex w-full items-center rounded-2xl py-2.5 text-sm font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/60 ${
          compacto ? 'justify-center px-0' : 'px-3.5 hover:translate-x-1'
        } ${
          isActive
            ? 'bg-white/10 text-white ring-1 ring-white/15'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* barrinha amarela do item ativo (a mesma cor do original) */}
          {isActive && (
            <span
              aria-hidden="true"
              className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-tj-blue"
            />
          )}

          {/* Ícone opcional exibido em todos os estados da barra. */}
          {Icone && <Icone className="h-5 w-5 shrink-0" />}

          {/* o texto some (largura 0 + transparente) quando a barra está recolhida */}
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
              compacto ? 'max-w-0 opacity-0' : 'ml-3 max-w-48 opacity-100'
            }`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

// Conteúdo compartilhado entre o desktop e o menu mobile.
function Conteudo({ onNavegar, compacto = false }) {
  return (
    <>
      {/* altura fixa (h-20) para o conteúdo não "pular" quando a barra expande */}
      <NavLink
        to="/dashboard"
        onClick={onNavegar}
        aria-label="Classme, ir para o painel"
        className="mb-6 flex h-20 w-full items-center justify-center"
      >
        {compacto ? (
          // recolhida: só o "CM" da marca
          <span
            aria-hidden="true"
            className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-4xl font-extrabold leading-none text-blue-500"
          >
            CM
          </span>
        ) : (
          // expandida: a logo completa
          <span className="text-5xl font-extrabold tracking-tight text-blue-500">
            CL<span className="font-bold">Ʌ</span>SS.ME 
          </span>
        )}
      </NavLink>

      {/* Área principal dos links de navegação. */}
      <nav aria-label="Navegação principal" className="flex flex-1 flex-col">
        {/* Agrupa os links principais do sistema. */}
        <div className="space-y-2">
          {mainItems.map((item) => (
            <NavItem key={item.to} {...item} onClick={onNavegar} compacto={compacto} />
          ))}
        </div>

        {/* Agrupa os links institucionais em uma seção separada. */}
        <div className="mt-6 space-y-2 border-t border-white/10 pt-6">
          {siteItems.map((item) => (
            <NavItem key={item.to} {...item} onClick={onNavegar} compacto={compacto} />
          ))}
        </div>

        {devItems.length > 0 && (
          <div className="mt-6 space-y-2 border-t border-dashed border-amber-400/40 pt-6">
            {/* o título "Dev" só aparece com a barra expandida */}
            {!compacto && (
              <p className="px-3.5 text-xs font-bold uppercase tracking-wide text-amber-300">Dev</p>
            )}
            {devItems.map((item) => (
              <NavItem key={item.to} {...item} onClick={onNavegar} compacto={compacto} />
            ))}
          </div>
        )}
      </nav>
    </>
  );
}

// O estado (aberto/fechado) vive no AppLayout; o botão de alternar fica no Header.
export default function Navbar({ aberto, onFechar }) {
  // Desktop: a barra fica recolhida (só ícones) e expande quando o mouse passa em cima
  const [expandida, setExpandida] = useState(false);

  // Esc fecha a gaveta (só no celular; no desktop a barra é parte da página)
  useEffect(() => {
    if (!aberto) return;
    // Captura o teclado para permitir fechar a gaveta com Escape no celular.
    const onKey = (e) => {
      if (e.key === 'Escape' && !window.matchMedia('(min-width: 1024px)').matches) onFechar();
    };
    window.addEventListener('keydown', onKey);
    // Remove o listener ao desmontar ou quando o estado da gaveta mudar.
    return () => window.removeEventListener('keydown', onKey);
  }, [aberto, onFechar]);

  // Não renderiza a navbar quando ela está fechada.
  if (!aberto) return null;

  return (
    <>
      {/* Versão desktop da navbar lateral. */}
      {/* desktop: espaço reservado na página (w-24) para o conteúdo não ficar embaixo da barra */}
      <div className="hidden w-24 shrink-0 lg:block">
        {/* a barra em si é "fixed" (flutua) e cresce por cima do conteúdo ao expandir.
            Expande com o mouse (hover) e também com o teclado (foco). */}
        <aside
          id="navegacao-lateral"
          // Atualiza a barra lateral conforme o mouse ou o foco entra e sai dela.
          onMouseEnter={() => setExpandida(true)}
          onMouseLeave={() => setExpandida(false)}
          onFocus={() => setExpandida(true)}
          onBlur={(e) => {
            // só recolhe se o foco saiu de dentro da barra
            if (!e.currentTarget.contains(e.relatedTarget)) setExpandida(false);
          }}
          className={`fixed inset-y-3 left-3 z-30 flex flex-col overflow-y-auto overflow-x-hidden rounded-3xl bg-navy p-3 text-white shadow-2xl shadow-slate-900/30 transition-[width] duration-300 ${
            expandida ? 'w-72' : 'w-[4.5rem]'
          }`}
        >
          <Conteudo compacto={!expandida} />
        </aside>
      </div>

      {/* celular: gaveta (igual ao original, sempre com os textos) */}
      <div className="fixed inset-0 z-40 lg:hidden">
        {/* Fundo escuro que fecha o menu ao ser clicado. */}
        <div className="absolute inset-0 animate-fade-in bg-slate-900/50" onClick={onFechar} aria-hidden="true" />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="absolute inset-y-0 left-0 flex animate-slide-in w-72 max-w-[85vw] flex-col overflow-y-auto bg-navy p-6 text-white shadow-2xl"
        >
          {/* Botão acessível para fechar o menu mobile. */}
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