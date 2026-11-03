import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icone from './Icone';
import { ICONES } from '../data/ajuda';

export default function Header({ user, visitante = false, navAberto, onAlternarMenu, onSair, onAbrirTour }) {
    const name = (user?.name ?? user?.username ?? '').trim() || 'Usuário';
    const role = user?.role;
    const avatar = user?.avatar;

    const [menuAberto, setMenuAberto] = useState(false);
    const menuRef = useRef(null);

    // fecha o menu ao clicar fora ou apertar Esc
    useEffect(() => {
        if (!menuAberto) return;

        const aoClicarFora = (e) => {
            if (!menuRef.current?.contains(e.target)) setMenuAberto(false);
        };
        const aoApertarTecla = (e) => e.key === 'Escape' && setMenuAberto(false);

        document.addEventListener('mousedown', aoClicarFora);
        document.addEventListener('keydown', aoApertarTecla);
        return () => {
            document.removeEventListener('mousedown', aoClicarFora);
            document.removeEventListener('keydown', aoApertarTecla);
        };
    }, [menuAberto]);

    return (
        <header className="flex h-17.5 items-center justify-between bg-white px-6 md:px-12">
            <button
                type="button"
                onClick={onAlternarMenu}
                aria-label={navAberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
                aria-expanded={navAberto}
                aria-controls="navegacao-lateral"
                className="grid h-10 w-10 place-items-center rounded-lg text-[#00264D] hover:bg-slate-100"
            >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                </svg>
            </button>

            <div ref={menuRef} className="relative">
                <button
                    type="button"
                    onClick={() => setMenuAberto((aberto) => !aberto)}
                    aria-label="Abrir menu do perfil"
                    aria-haspopup="menu"
                    aria-expanded={menuAberto}
                    title="Perfil e configurações"
                    className="flex items-center gap-3 rounded-full py-1 pl-1 pr-3 transition hover:bg-slate-100"
                >
                    {avatar ? (
                        <img src={avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                    ) : (
                        <div className="grid h-11 w-11 place-items-center rounded-full bg-[#F49624] text-sm font-bold text-white">
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="text-left leading-tight">
                        <p className="text-sm font-bold text-slate-800">{name}</p>
                        {role && <p className="text-xs text-slate-500">{role}</p>}
                    </div>
                    <svg viewBox="0 0 20 20" className={`h-4 w-4 text-slate-500 transition-transform ${menuAberto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {menuAberto && (
                    <div
                        role="menu"
                        className="absolute right-0 top-full z-30 mt-2 w-64 origin-top-right animate-pop rounded-xl bg-white p-1 shadow-lg ring-1 ring-slate-200"
                    >
                        <div className="border-b border-slate-100 px-3 py-2.5">
                            <p className="truncate text-sm font-bold text-slate-800">{name}</p>
                            <p className="truncate text-xs text-slate-500">{user?.email ?? (visitante ? 'Modo visitante' : '')}</p>
                        </div>

                        <Link
                            to="/configuracoes"
                            role="menuitem"
                            onClick={() => setMenuAberto(false)}
                            className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                            <Icone d={ICONES.engrenagem} className="h-4 w-4 text-[#004A8F]" />
                            Perfil e configurações
                        </Link>
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setMenuAberto(false);
                                onAbrirTour?.();
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                            <Icone d={ICONES.ajuda} className="h-4 w-4 text-[#004A8F]" />
                            Como usar o clʌss.me
                        </button>
                        <button
                            type="button"
                            role="menuitem"
                            onClick={onSair}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                            <Icone d={ICONES.sair} className="h-4 w-4 text-slate-500" />
                            {visitante ? 'Sair do modo visitante' : 'Sair'}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
