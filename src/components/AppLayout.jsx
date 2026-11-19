import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';
import Navbar from './Navbar';
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
  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
  const menuPerfilRef = useRef(null);

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

  useEffect(() => {
    if (!menuPerfilAberto) return;

    const aoClicarFora = (event) => {
      if (!menuPerfilRef.current?.contains(event.target)) setMenuPerfilAberto(false);
    };
    const aoApertarTecla = (event) => {
      if (event.key === 'Escape') setMenuPerfilAberto(false);
    };

    document.addEventListener('mousedown', aoClicarFora);
    document.addEventListener('keydown', aoApertarTecla);
    return () => {
      document.removeEventListener('mousedown', aoClicarFora);
      document.removeEventListener('keydown', aoApertarTecla);
    };
  }, [menuPerfilAberto]);

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
    <div className="flex min-h-screen bg-page font-['Nunito',sans-serif]">
      <Navbar aberto={navAberto} onFechar={fecharNav} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center px-4 md:px-8">
          <button
            type="button"
            onClick={alternarNav}
            aria-label={navAberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={navAberto}
            aria-controls="navegacao-lateral"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-[#00264D] hover:bg-slate-200/60 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>

          <div ref={menuPerfilRef} className="relative ml-auto">
            <button
              type="button"
              onClick={() => setMenuPerfilAberto((aberto) => !aberto)}
              aria-label="Abrir menu do perfil"
              aria-haspopup="menu"
              aria-expanded={menuPerfilAberto}
              title="Perfil e configurações"
              className="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-slate-100"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#F49624] text-xs font-semibold text-white">
                  {(user?.name ?? user?.username ?? 'Usuário').trim().charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden text-left leading-tight sm:block">
                <p className="text-xs font-semibold text-slate-800">
                  {(user?.name ?? user?.username ?? '').trim() || 'Usuário'}
                </p>
                {user?.role && <p className="text-[11px] text-slate-500">{user.role}</p>}
              </div>
              <svg viewBox="0 0 20 20" className={`h-3.5 w-3.5 text-slate-500 transition-transform ${menuPerfilAberto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {menuPerfilAberto && (
              <div role="menu" className="absolute right-0 top-full z-30 mt-2 w-60 origin-top-right animate-pop rounded-xl bg-white p-1 shadow-lg ring-1 ring-slate-200">
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="truncate text-xs font-semibold text-slate-800">
                    {(user?.name ?? user?.username ?? '').trim() || 'Usuário'}
                  </p>
                  <p className="truncate text-[11px] text-slate-500">{user?.email ?? ''}</p>
                </div>
                <Link
                  to="/configuracoes"
                  role="menuitem"
                  onClick={() => setMenuPerfilAberto(false)}
                  className="mt-1 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <UserIcon className="h-4 w-4 shrink-0" />
                  Perfil e configurações
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuPerfilAberto(false);
                    handleSair();
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="flex-1">
          {/* key = rota: a cada página nova o conteúdo entra com uma animação suave.
              Só opacidade (fade-in): o fade-up usa transform e, com o fill "both", o transform
              continua aplicado depois da animação. Isso faz o navegador tratar esta caixa como
              a "tela" de tudo que é position: fixed lá dentro (botão +, modais, overlays). */}
          <div key={location.pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </div>
      {tourAberto && <TourInicial onFechar={fecharTour} />}
    </div>
  );
}
