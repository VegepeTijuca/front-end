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

// Mesmo breakpoint usado no AppLayout: a partir dele a navbar é lateral (desktop);
// abaixo dele vira uma gaveta (celular/tablet).
const DESKTOP = '(min-width: 1024px)';

// Itens principais exibidos na navegação lateral.
const mainItems = [
  { label: 'Visão Geral', Icone: House, to: '/dashboard', dica: 'Resumo do dia, calendário, timer e tarefas' },
  { label: 'Calendário', Icone: Calendar, to: '/calendario', dica: 'Calendário em tela cheia' },
  { label: 'Disciplinas', Icone: BookOpen, to: '/disciplinas', dica: 'Matérias e conteúdos' },
];

// Itens institucionais da navegação.
const siteItems = [{ label: 'Sobre', Icone: Info, to: '/sobre', dica: 'Sobre o clʌss.me' }];

// Link de navegação com ícone, texto e indicador de página ativa.
// No modo compacto, apenas o ícone fica visível.
function NavItem({ label, Icone, to, dica, end, onClick, compacto }) {
  return (
    // O NavLink aplica o estilo "ativo" de acordo com a rota atual.
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      title={dica ?? label}
      className={({ isActive }) =>
        `cursor-pointer relative flex w-full items-center rounded-2xl py-2.5 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/60 ${
          compacto ? 'justify-center px-0' : 'px-3.5'
        } ${
          isActive
            ? 'bg-white/10 text-white ring-1 ring-white/15'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Barrinha colorida que marca o item ativo. */}
          {isActive && (
            <span
              aria-hidden="true"
              className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-tj-blue"
            />
          )}

          {/* Ícone: aparece em todos os estados da barra. */}
          {Icone && <Icone className="h-5 w-5 shrink-0" />}

          {/* O texto "some" (largura 0 + transparente) quando a barra está recolhida.
              Ao expandir, espera um instante (delay) para não aparecer espremido
              enquanto a barra ainda está crescendo. */}
          <span
            className={`overflow-hidden whitespace-nowrap transition-[max-width,margin,opacity] duration-300 ${
              compacto ? 'ml-0 max-w-0 opacity-0' : 'ml-3 max-w-48 opacity-100 delay-100'
            }`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

// Logo da navbar. As duas versões ficam empilhadas e trocam por opacidade (crossfade),
// em vez de serem montadas/desmontadas, o que evitava o "pulo" visual.
function Logo({ compacto }) {
  return (
    <span className="relative block h-full w-full">
      {/* Versão recolhida: só o símbolo da marca. */}
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

      {/* Versão expandida: logo completa.
          text-4xl + whitespace-nowrap garantem que cabe na largura da barra/gaveta,
          inclusive em celulares pequenos (antes era text-5xl e estourava). */}
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

// Conteúdo compartilhado entre o desktop e a gaveta mobile.
function Conteudo({ onNavegar, compacto = false }) {
  return (
    <>
      {/* Altura fixa (h-20) para o conteúdo não "pular" quando a barra expande. */}
      <NavLink
        to="/dashboard"
        onClick={onNavegar}
        aria-label="Classme, ir para o painel"
        className="mb-6 block h-20 w-full shrink-0 cursor-pointer"
      >
        <Logo compacto={compacto} />
      </NavLink>

      {/* Área principal dos links de navegação. */}
      <nav aria-label="Navegação principal" className="flex flex-1 flex-col">
        {/* Links principais do sistema. */}
        <div className="space-y-2">
          {mainItems.map((item) => (
            <NavItem key={item.to} {...item} onClick={onNavegar} compacto={compacto} />
          ))}
        </div>

        {/* Links institucionais, em uma seção separada. */}
        <div className="mt-6 space-y-2 border-t border-white/10 pt-6">
          {siteItems.map((item) => (
            <NavItem key={item.to} {...item} onClick={onNavegar} compacto={compacto} />
          ))}
        </div>

      </nav>
    </>
  );
}

// O estado (aberto/fechado) vive no AppLayout; o botão de alternar fica no Header.
// A navbar fica SEMPRE montada: abrir/fechar é só uma transição de CSS, o que permite
// animar também a saída (antes ela era desmontada de uma vez, sem animação).
export default function Navbar({ aberto, onFechar }) {
  // Desktop: a barra fica recolhida (só ícones) e expande quando o mouse passa em cima.
  const [expandida, setExpandida] = useState(false);

  // Esc fecha a gaveta (só no celular; no desktop a barra faz parte da página).
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && !window.matchMedia(DESKTOP).matches) onFechar();
    };
    window.addEventListener('keydown', onKey);
    // Remove o listener ao fechar ou desmontar.
    return () => window.removeEventListener('keydown', onKey);
  }, [aberto, onFechar]);

  // Trava a rolagem da página enquanto a gaveta está aberta no celular.
  useEffect(() => {
    if (!aberto || window.matchMedia(DESKTOP).matches) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [aberto]);

  // Se a navbar fechar enquanto estava expandida, volta ao estado recolhido.
  useEffect(() => {
    if (!aberto) setExpandida(false);
  }, [aberto]);

  return (
    <>
      {/* Desktop: fundo escurecido enquanto a barra está expandida.
          Sempre montado e animado por opacidade; só recebe clique quando visível. */}
      <div
        className={`fixed inset-0 z-20 hidden bg-black/50 transition-opacity duration-300 lg:block ${
          expandida ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
        onClick={() => setExpandida(false)}
      />

      {/* Desktop: espaço reservado na página para o conteúdo não ficar embaixo da barra.
          A largura anima até 0 quando o menu é fechado, então o conteúdo desliza suavemente. */}
      <div
        className={`hidden shrink-0 transition-[width] duration-300 ease-out lg:block ${
          aberto ? 'w-24' : 'w-0'
        }`}
      >
        {/* A barra em si é "fixed" (flutua) e cresce por cima do conteúdo ao expandir.
            Expande com o mouse (hover) e também com o teclado (foco). */}
        <aside
          id="navegacao-lateral"
          onMouseEnter={() => setExpandida(true)}
          onMouseLeave={() => setExpandida(false)}
          onFocus={() => setExpandida(true)}
          onBlur={(e) => {
            // Só recolhe se o foco saiu de dentro da barra.
            if (!e.currentTarget.contains(e.relatedTarget)) setExpandida(false);
          }}
          className={`fixed inset-y-3 left-3 z-30 flex flex-col overflow-y-auto overflow-x-hidden rounded-3xl bg-navy p-3 text-white shadow-2xl shadow-slate-900/30 transition-[width,transform,visibility] duration-300 ease-out ${
            expandida ? 'w-72' : 'w-[4.5rem]'
          } ${aberto ? 'visible translate-x-0' : 'invisible -translate-x-[calc(100%+1rem)]'}`}
        >
          <Conteudo compacto={!expandida} />
        </aside>
      </div>

      {/* Celular/tablet: gaveta com os textos sempre visíveis.
          "invisible" (com transição) impede foco e clique quando fechada,
          mas só é aplicado depois que a animação de saída termina. */}
      <div
        className={`fixed inset-0 z-40 transition-[visibility] duration-300 lg:hidden ${
          aberto ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        {/* Fundo escuro que fecha o menu ao ser clicado. */}
        <div
          className={`absolute inset-0 bg-slate-900/50 transition-opacity duration-300 ${
            aberto ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onFechar}
          aria-hidden="true"
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
          {/* Botão acessível para fechar a gaveta. */}
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar menu"
            className="mb-4 self-end rounded-lg p-2 text-white hover:bg-white/10 cursor-pointer disabled:cursor-not-allowed"
          >
            <span aria-hidden="true">✕</span>
          </button>
          <Conteudo onNavegar={onFechar} />
        </aside>
      </div>
    </>
  );
}
