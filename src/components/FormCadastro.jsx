import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, registrar } from '../services/authService';
import useAuth from '../hooks/useAuth';

export default function FormCadastro() {
    const [credenciaisUsuario, setCredenciaisUsuario] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
    const [erros, setErros] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();
    const { entrar } = useAuth();


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'confirmacaoSenha') {
            setConfirmacaoSenha(value);
        } else {
            setCredenciaisUsuario((atual) => ({ ...atual, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errosValidacao = [];

        if (!credenciaisUsuario.name.trim()) {
            errosValidacao.push('Por favor, insira um nome de usuário.');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credenciaisUsuario.email)) {
            errosValidacao.push('Por favor, insira um e-mail válido.');
        }
        if (credenciaisUsuario.password.length < 6) {
            errosValidacao.push('A senha deve ter pelo menos 6 caracteres.');
        }
        if (credenciaisUsuario.password !== confirmacaoSenha) {
            errosValidacao.push('As senhas não conferem.');
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(credenciaisUsuario.password)) {
            errosValidacao.push('A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número.');
        }

        setErros(errosValidacao);
        if (errosValidacao.length > 0) {
            return;
        }

        setCarregando(true);
        try {
            let sessao = await registrar(credenciaisUsuario);

            // se a API não devolveu o token no cadastro, entra com o e-mail e a senha recém-criados
            if (!sessao?.token) {
                sessao = await login({
                    email: credenciaisUsuario.email,
                    password: credenciaisUsuario.password,
                });
            }

            entrar(sessao.token, sessao.user);
            navigate('/setup-usuario', { replace: true });
        } catch (err) {
            const erroApi = err.response?.data?.message ?? err.response?.data?.error;
            setErros([
                typeof erroApi === 'string' ? erroApi : erroApi?.message ?? 'Não foi possível criar a conta.',
            ]);
        } finally {
            setCarregando(false);
        }
    };

    // mesmas classes do login: rótulo discreto e campos só com a linha embaixo
    const labelClasses = 'block text-sm font-medium text-slate-600';
    const inputClasses = 'mt-1 block w-full rounded-t-lg border-0 border-b border-slate-300 bg-transparent px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00264D] focus:bg-slate-50';

    const steps = [
        { numero: 1, titulo: 'Crie sua conta', ativo: true },
        { numero: 2, titulo: 'Configure as informações do seu perfil' },
        { numero: 3, titulo: 'Comece a organizar seus estudos' },
    ];

    return (
        <div className="grid min-h-screen bg-white lg:grid-cols-2">
            {/* painel de boas-vindas (mesmo fundo e círculos do login) */}
            <div className="relative hidden overflow-hidden bg-[linear-gradient(165deg,#004A8F,#00356B_55%,#00264D)] p-10 text-white lg:flex lg:flex-col lg:justify-center lg:px-20 lg:py-12">
                {/* círculos decorativos */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <div className="absolute -right-24 top-16 h-136 w-136 rounded-full border border-white/10" />
                    <div className="absolute -right-40 top-28 h-160 w-160 rounded-full border border-white/10" />
                    <div className="absolute -right-56 top-40 h-184 w-184 rounded-full border border-white/10" />
                    <div className="absolute -right-72 top-52 h-208 w-208 rounded-full border border-white/10" />
                    <div className="absolute -bottom-40 -left-32 h-112 w-md rounded-full bg-white/5" />
                </div>

                <div className="relative">
                    <span className="inline-block rounded-full bg-white/20 px-5 py-2.5 text-sm font-medium backdrop-blur">
                        Junte-se ao clʌss.me!
                    </span>

                    <h1 className="mt-6 max-w-md text-6xl font-extrabold leading-[1.1] tracking-tight">
                        Comece sua jornada!
                    </h1>

                    <p className="mt-6 max-w-md text-lg leading-snug text-white/80">
                        Siga estes passos simples para configurar sua conta.
                    </p>

                    {/* passo a passo 1, 2, 3 */}
                    <ol className="mt-10 grid max-w-xl grid-cols-3 gap-4">
                        {steps.map((step) => (
                            <li
                                key={step.numero}
                                className={`flex min-h-40 flex-col justify-between rounded-3xl p-4 text-sm font-medium ${
                                    step.ativo ? 'bg-white text-slate-900' : 'bg-white/15 text-white/70'
                                }`}
                            >
                                <span
                                    className={`grid h-8 w-8 place-items-center rounded-full text-sm ${
                                        step.ativo
                                            ? 'bg-brand text-white'
                                            : 'border border-white/50 text-white/80'
                                    }`}
                                >
                                    {step.numero}
                                </span>
                                {step.titulo}
                            </li>
                        ))}
                    </ol>
                </div>

                <p className="absolute bottom-10 left-20 text-sm text-white/50">
                    © 2026 clʌss.me. Todos os direitos reservados.
                </p>
            </div>

            {/* lado do formulário */}
            <div className="relative z-10 flex flex-col px-6 py-10 sm:px-12 lg:px-20 lg:shadow-[-24px_0_60px_-34px_rgba(15,23,42,0.25)]">
                <p className="text-3xl font-extrabold tracking-tight text-brand">
                    cl<span className="font-bold">ʌ</span>ss.me
                </p>

                <div className="flex flex-1 items-center py-10">
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="mx-auto w-full max-w-md space-y-6"
                    >
                        <header className="space-y-2">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                Criar conta
                            </h2>
                            <p className="text-sm text-slate-500">
                                Preencha seus dados para se cadastrar.
                            </p>
                            <p className="text-sm text-slate-500">
                                Já tem uma conta?{' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-brand underline underline-offset-2 hover:text-brand"
                                >
                                    Entrar
                                </Link>
                            </p>
                        </header>

                        {erros.length > 0 && (
                            <div className="space-y-2">
                                {erros.map((erro, index) => (
                                    <p key={index} role="alert" className="text-sm text-[#A85A00]">
                                        {erro}
                                    </p>
                                ))}
                            </div>
                        )}

                        <div>
                            <label className={labelClasses} htmlFor="name">
                                Nome de usuário
                            </label>
                            <input
                                className={inputClasses}
                                id="name"
                                name="name"
                                value={credenciaisUsuario.name}
                                type="text"
                                autoComplete="name"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClasses} htmlFor="email">
                                E-mail
                            </label>
                            <input
                                className={inputClasses}
                                id="email"
                                name="email"
                                value={credenciaisUsuario.email}
                                type="email"
                                autoComplete="email"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
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
                                    autoComplete="new-password"
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label className={labelClasses} htmlFor="confirmacaoSenha">
                                    Confirme sua senha
                                </label>
                                <input
                                    className={inputClasses}
                                    id="confirmacaoSenha"
                                    name="confirmacaoSenha"
                                    value={confirmacaoSenha}
                                    type="password"
                                    autoComplete="new-password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            className="w-full rounded-xl bg-brand px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-navy/20 transition hover:bg-[#003B73] focus:outline-none focus:ring-4 focus:ring-brand/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                            name="criarConta"
                            type="submit"
                            disabled={carregando}
                        >
                            {carregando ? 'Criando conta...' : 'Criar conta'}
                        </button>

                        <button
                            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
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
                            Cadastrar com o Google (em breve)
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}