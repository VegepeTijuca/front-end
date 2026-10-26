import { useEffect, useRef, useState } from 'react';

export default function Header({ user, navAberto, onAlternarMenu, onSair }) {
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
                className="grid h-10 w-10 place-items-center rounded-lg text-[#0A1F4D] hover:bg-slate-100"
            >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                </svg>
            </button>

            <div className="flex items-center gap-3">
                {avatar ? (
                    <img
                        src={avatar}
                        alt={name}
                        className="h-11 w-11 rounded-full object-cover"
                    />
                ) : (
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-pink-300 text-sm font-bold text-white">
                        {name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="leading-tight">
                    <p className="text-sm font-bold text-slate-800">{name}</p>
                    {role && <p className="text-xs text-slate-500">{role}</p>}
                </div>

                <div ref={menuRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setMenuAberto((aberto) => !aberto)}
                        aria-label="Abrir menu do usuário"
                        aria-haspopup="menu"
                        aria-expanded={menuAberto}
                        className="grid h-5 w-5 place-items-center rounded-full border border-slate-300 text-slate-500"
                    >
                        <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {menuAberto && (
                        <div
                            role="menu"
                            className="absolute right-0 top-full z-30 mt-2 w-40 rounded-xl bg-white p-1 shadow-lg ring-1 ring-slate-200"
                        >
                            <button
                                type="button"
                                role="menuitem"
                                onClick={onSair}
                                className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                            >
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}