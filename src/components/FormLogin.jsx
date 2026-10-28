import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import useAuth from '../hooks/useAuth';

export default function FormLogin() {
    const [credenciaisUsuario, setCredenciaisUsuario] = useState({
        email: '',
        password: '',
    });
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { entrar } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredenciaisUsuario((atual) => ({ ...atual, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            const data = await login(credenciaisUsuario);
            entrar(data.token, data.user);
            navigate(location.state?.de ?? '/dashboard', { replace: true });
        } catch (err) {
            setErro(err.response?.data?.error ?? 'Não foi possível entrar.');
        } finally {
            setCarregando(false);
        }
    };

    const labelClasses = 'block text-sm font-medium text-slate-600';
    const inputClasses = 'mt-1 block w-full rounded-t-lg border-0 border-b border-slate-300 bg-transparent px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0A1F4D] focus:bg-slate-50';

    return (
        <div className="grid min-h-screen bg-white lg:grid-cols-2">
            {/* painel de boas-vindas */}
            <div className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_50%_18%,rgba(191,219,254,0.75),transparent_42%),radial-gradient(ellipse_at_55%_62%,#38bdf8,transparent_58%),linear-gradient(165deg,#3349D6,#1c2aa8_55%,#141d85)] p-10 text-white lg:flex lg:flex-col lg:justify-center lg:px-20 lg:py-12">
                {/* círculos decorativos */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <div className="absolute -right-24 top-16 h-136 w-136 rounded-full border border-white/10" />
                    <div className="absolute -right-40 top-28 h-160 w-160 rounded-full border border-white/10" />
                    <div className="absolute -right-56 top-40 h-184 w-184 rounded-full border border-white/10" />
                    <div className="absolute -right-72 top-52 h-208 w-208 rounded-full border border-white/10" />
                    <div className="absolute -bottom-40 -left-32 h-112 w-md rounded-full bg-white/5 blur-3xl" />
                </div>
                <div className="relative">

                    <h1 className="mt-10 max-w-md text-6xl font-extrabold leading-[1.1] tracking-tight">
                        Bem-vindo de volta ao CLɅSS.ME!<span aria-hidden="true">👋</span>
                    </h1>

                    <p className="mt-8 max-w-md text-lg leading-snug text-white/80">
                        Organize seus estudos, acompanhe suas tarefas e mantenha o foco com o
                        timer, tudo em um só lugar.
                    </p>
                </div>

                <p className="absolute bottom-10 left-20 text-sm text-white/50">
                    © 2026 clʌss.me. Todos os direitos reservados.
                </p>
            </div>

            {/* lado do formulário */}
            <div className="relative z-10 flex flex-col px-6 py-10 sm:px-12 lg:px-20 lg:shadow-[-30px_0_70px_-30px_rgba(51,73,214,0.45)]">
                <p className="text-3xl font-extrabold tracking-tight text-brand">
                    clʌss.me
                </p>

                <div className="flex flex-1 items-center py-10">
                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto w-full max-w-sm space-y-6"
                    >
                        <header className="space-y-2">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                Entrar
                            </h2>
                            <p className="text-sm text-slate-500">
                                Acesse sua conta para continuar.
                            </p>
                            <p className="text-sm text-slate-500">
                                Não tem uma conta?{' '}
                                <Link
                                    to="/cadastro"
                                    className="font-semibold text-brand underline underline-offset-2 hover:text-brand"
                                >
                                    Crie uma agora
                                </Link>
                                , é grátis e leva menos de um minuto.
                            </p>
                        </header>

                        {erro && <p role="alert" className="text-sm text-red-600">{erro}</p>}

                        <div>
                            <label className={labelClasses} htmlFor="email">
                                E-mail ou nome de usuário
                            </label>
                            <input
                                className={inputClasses}
                                id="email"
                                name="email"
                                value={credenciaisUsuario.email}
                                type="text"
                                autoComplete="username"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClasses} htmlFor="password">
                                Senha
                            </label>
                            <input
                                className={inputClasses}
                                id="password"
                                name="password"
                                value={credenciaisUsuario.password}
                                type="password"
                                autoComplete="current-password"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            className="w-full rounded-xl bg-brand px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-navy/20 transition hover:bg-[#12306e] focus:outline-none focus:ring-4 focus:ring-brand/30 active:scale-[0.99]"
                            name="entrar"
                            type="submit"
                            disabled={carregando}
                        >
                            {carregando ? 'Entrando...' : 'Entrar'}
                        </button>

                        <button
                            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
                            type="button"
                            disabled
                            title="Em breve"
                        >
                            <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            Entrar com o Google
                        </button>

                        <p className="text-center text-sm text-slate-500">
                            Esqueceu a senha?{' '}
                            <Link
                                to="/recuperar-senha"
                                className="font-semibold text-slate-900 underline underline-offset-2 hover:text-brand"
                            >
                                Clique aqui
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}