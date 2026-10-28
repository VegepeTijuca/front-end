import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrar } from '../services/authService';
import useAuth from '../hooks/useAuth';


export default function FormCadastro() {
    const [credenciaisUsuario, setCredenciaisUsuario] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
    const [erro, setErro] = useState('');
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
        setErro('');

        if (credenciaisUsuario.password !== confirmacaoSenha) {
            setErro('As senhas não conferem.');
            return;
        }

        setCarregando(true);
        try {
            const data = await registrar(credenciaisUsuario);

            if (data?.token) {
                entrar(data.token, data.user);
                navigate('/setup-usuario', { replace: true });
            } else {
                navigate('/login');
            }
        } catch (err) {
            setErro(err.response?.data?.message ?? 'Não foi possível criar a conta.');
        } finally {
            setCarregando(false);
        }
    };

    const labelClasses = 'block text-sm font-semibold text-slate-900';
    const inputClasses = 'mt-2 block w-full rounded-2xl border border-transparent bg-slate-50 px-5 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#3349D6] focus:bg-white focus:ring-4 focus:ring-[#3349D6]/15';

    const steps = [
        { numero: 1, titulo: 'Crie sua conta', ativo: true },
        { numero: 2, titulo: 'Configure as informações do seu perfil' },
        { numero: 3, titulo: 'Comece a organizar seus estudos' },
    ];

    return (
        <div className="min-h-screen bg-[#0055fff0] p-3 sm:p-5">
            <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-7xl overflow-hidden rounded-4xl bg-white shadow-xl shadow-slate-900/10 sm:min-h-[calc(100vh-2.5rem)] lg:grid-cols-2 lg:p-3">
                {/* painel de começar a jornada */}
                <div className="relative hidden flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_60%_18%,rgba(191,219,254,0.75),transparent_42%),radial-gradient(ellipse_at_55%_62%,#38bdf8,transparent_58%),linear-gradient(165deg,#3349D6,#1c2aa8_55%,#141d85)] p-10 text-white lg:flex">
                   {/*fundo decoração gradient */}
                    <p className="text-3xl font-semibold tracking-tight">clʌss.me</p>

                    <div>
                        <span className="inline-block rounded-full bg-white/20 px-5 py-2.5 text-sm font-medium backdrop-blur">
                            Junte-se ao clʌss.me!
                        </span>

                        <h1 className="mt-5 text-5xl font-semibold tracking-tight xl:text-6xl">
                            Comece sua jornada!
                        </h1>

                        <p className="mt-3 text-lg text-white/80">
                            Siga estes passos simples para configurar sua conta.
                        </p>

                        <ol className="mt-10 grid grid-cols-3 gap-4">
                            {steps.map((step) => (
                                <li
                                    key={step.numero}
                                    className={`flex min-h-40 flex-col justify-between rounded-3xl p-4 text-sm font-medium backdrop-blur ${
                                        step.ativo ? 'bg-white text-slate-900' : 'bg-white/15 text-white/70'
                                    }`}
                                >
                                    <span
                                        className={`grid h-8 w-8 place-items-center rounded-full text-sm ${
                                            step.ativo
                                                ? 'bg-[#3349D6] text-white'
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
                </div>

                {/* lado do formulário */}
                <div className="flex flex-col px-6 py-10 sm:px-12 lg:px-14">
                    <p className="text-3xl font-semibold tracking-tight text-[#3349D6] lg:hidden">
                        clʌss.me
                    </p>

                    <div className="flex flex-1 items-center py-8">
                        <form
                            onSubmit={handleSubmit}
                            className="mx-auto w-full max-w-md space-y-5"
                        >
                            <header className="space-y-2 pb-2 text-center">
                                <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
                                    Criar conta
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Preencha seus dados para se cadastrar.
                                </p>
                            </header>

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

                            <div className="grid gap-5 sm:grid-cols-2">
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
                                        minLength={8}
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

                            {erro && (
                                <p role="alert" className="text-sm text-red-600">
                                    {erro}
                                </p>
                            )}

                            <button
                                className="w-full rounded-2xl bg-[#3349D6] px-4 py-4 text-base font-semibold text-white shadow-md shadow-[#3349D6]/25 transition hover:bg-[#2a3dbb] focus:outline-none focus:ring-4 focus:ring-[#3349D6]/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                name="criarConta"
                                type="submit"
                                disabled={carregando}
                            >
                                {carregando ? 'Criando conta...' : 'Criar conta'}
                            </button>

                            <p className="text-center text-sm text-slate-600">
                                Já tem uma conta?{' '}
                                <Link to="/login" className="font-semibold text-[#3349D6] hover:underline">
                                    Entrar
                                </Link>
                            </p>

                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="h-px flex-1 bg-slate-200" />
                                Ou
                                <span className="h-px flex-1 bg-slate-200" />
                            </div>

                            <button
                                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                                type="button"
                                disabled
                                title="Em breve"
                            >
                                Cadastrar com o Google (em breve)
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}