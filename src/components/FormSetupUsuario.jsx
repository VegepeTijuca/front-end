import { useState } from 'react';
import { Link } from 'react-router-dom';
import { salvarPreferencias } from '../services/usuarioService';

import { perguntas } from '../data/perguntas';

const passosConta = [
    { numero: 1, titulo: 'Crie sua conta', feito: true },
    { numero: 2, titulo: 'Configure as informações do seu perfil', ativo: true },
    { numero: 3, titulo: 'Comece a organizar seus estudos' },
];

// moldura igual à do login e do cadastro
function Moldura({ children }) {
    return (
        <div className="min-h-screen bg-[#F4F6FA] p-3 font-['Nunito',sans-serif] sm:p-5">
            <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-7xl overflow-hidden rounded-4xl bg-white shadow-xl shadow-slate-900/10 sm:min-h-[calc(100vh-2.5rem)] lg:grid-cols-2 lg:p-3">
                <div className="relative hidden flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[linear-gradient(165deg,#004A8F,#00356B_55%,#00264D)] p-10 text-white lg:flex">
                    <p className="text-3xl font-extrabold tracking-tight">clʌss.me</p>

                    <div>
                        <span className="inline-block rounded-full bg-white/20 px-5 py-2.5 text-sm font-medium backdrop-blur">
                            Quase lá!
                        </span>
                        <h1 className="mt-5 text-5xl font-medium leading-tight tracking-tight xl:text-6xl">
                            Vamos personalizar seus estudos
                        </h1>
                        <p className="mt-3 text-lg text-white/80">
                            Leva menos de um minuto e você pode mudar tudo depois.
                        </p>

                        <ol className="mt-10 grid grid-cols-3 gap-4">
                            {passosConta.map((passo) => (
                                <li
                                    key={passo.numero}
                                    className={`flex min-h-40 flex-col justify-between rounded-3xl p-4 text-sm font-medium ${
                                        passo.ativo ? 'bg-white text-slate-900' : 'bg-white/15 text-white/70'
                                    }`}
                                >
                                    <span
                                        className={`grid h-8 w-8 place-items-center rounded-full text-sm ${
                                            passo.ativo
                                                ? 'bg-[#004A8F] text-white'
                                                : passo.feito
                                                  ? 'bg-white/90 text-[#004A8F]'
                                                  : 'border border-white/50 text-white/80'
                                        }`}
                                    >
                                        {passo.feito ? '✓' : passo.numero}
                                    </span>
                                    {passo.titulo}
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                <div className="flex flex-col px-6 py-10 sm:px-12 lg:px-14">
                    <p className="text-3xl font-semibold tracking-tight text-[#004A8F] lg:hidden">clʌss.me</p>
                    <div className="flex flex-1 items-center py-8">
                        <div className="mx-auto w-full max-w-lg animate-fade-up">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FormSetupUsuario() {
    const [perguntaAtual, setPerguntaAtual] = useState(0);
    const [respostas, setRespostas] = useState({});
    const [outro, setOutro] = useState('');
    const [escolhendoOutro, setEscolhendoOutro] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState('');
    const [concluido, setConcluido] = useState(false);

    const pergunta = perguntas[perguntaAtual];
    const ehUltima = perguntaAtual === perguntas.length - 1;

    async function enviar(dados) {
        setEnviando(true);
        setErro('');
        try {
            await salvarPreferencias(dados);
            setConcluido(true);
        } catch {
            setErro('Não foi possível salvar suas preferências.');
        } finally {
            setEnviando(false);
        }
    }

    function responder(valor, extra = {}) {
        const novas = { ...respostas, [pergunta.id]: valor, ...extra };
        if (pergunta.id === 'area' && valor !== 'Outro') delete novas.areaOutro;
        setRespostas(novas);
        setEscolhendoOutro(false);

        if (ehUltima) {
            enviar(novas);
        } else {
            setPerguntaAtual((atual) => atual + 1);
        }
    }

    function escolher(opcao) {
        if (opcao === 'Outro') {
            setEscolhendoOutro(true);
            return;
        }
        responder(opcao);
    }

    function confirmarOutro(e) {
        e.preventDefault();
        const texto = outro.trim();
        if (!texto) return;
        responder('Outro', { areaOutro: texto });
    }

    function voltar() {
        setErro('');
        setEscolhendoOutro(false);
        setPerguntaAtual((atual) => Math.max(0, atual - 1));
    }

    if (concluido) {
        return (
            <Moldura>
                <div className="text-center">
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#004A8F]/10 text-3xl">
                        🎉
                    </span>
                    <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900">Tudo pronto!</h2>
                    <p className="mt-3 text-slate-500">
                        Suas respostas foram salvas. Agora é só começar a organizar seus estudos.
                    </p>
                    <Link
                        to="/dashboard"
                        className="mt-8 inline-block rounded-2xl bg-[#004A8F] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#003B73]"
                    >
                        Ir para o painel
                    </Link>
                </div>
            </Moldura>
        );
    }

    return (
        <Moldura>
            <div className="flex items-center justify-between text-sm">
                <p className="font-semibold text-[#004A8F]">
                    Pergunta {perguntaAtual + 1} de {perguntas.length}
                </p>
                <Link to="/dashboard" className="text-slate-500 hover:text-[#00264D]">
                    Pular por agora
                </Link>
            </div>

            <div
                role="progressbar"
                aria-label="Progresso das perguntas"
                aria-valuemin={0}
                aria-valuemax={perguntas.length}
                aria-valuenow={perguntaAtual + 1}
                className="mt-3 flex gap-1.5"
            >
                {perguntas.map((p, i) => (
                    <div
                        key={p.id}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                            i <= perguntaAtual ? 'bg-[#004A8F]' : 'bg-slate-200'
                        }`}
                    />
                ))}
            </div>

            <h1 key={pergunta.id} className="mt-8 animate-fade-up text-3xl font-semibold tracking-tight text-slate-900">
                {pergunta.titulo}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{pergunta.ajuda}</p>

            <div className="mt-6 space-y-3">
                {pergunta.opcoes.map((opcao, i) => {
                    const selecionada =
                        respostas[pergunta.id] === opcao.valor || (opcao.valor === 'Outro' && escolhendoOutro);
                    return (
                        <button
                            key={`${pergunta.id}-${opcao.valor}`}
                            style={{ animationDelay: `${i * 60}ms` }}
                            type="button"
                            disabled={enviando}
                            onClick={() => escolher(opcao.valor)}
                            aria-pressed={selecionada}
                            className={`flex w-full animate-fade-up items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] hover:border-[#004A8F] hover:bg-[#004A8F]/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#004A8F]/20 disabled:opacity-60 ${
                                selecionada ? 'border-[#004A8F] bg-[#004A8F]/5' : 'border-slate-200 bg-white'
                            }`}
                        >
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-xl">
                                {opcao.emoji}
                            </span>
                            <span>
                                <span className="block font-semibold text-slate-900">{opcao.valor}</span>
                                <span className="block text-sm text-slate-500">{opcao.descricao}</span>
                            </span>
                        </button>
                    );
                })}
            </div>

            {escolhendoOutro && (
                <form onSubmit={confirmarOutro} className="mt-4 flex gap-3">
                    <input
                        autoFocus
                        value={outro}
                        onChange={(e) => setOutro(e.target.value)}
                        placeholder="O que você quer estudar?"
                        aria-label="Outra área de estudo"
                        className="h-12 flex-1 rounded-2xl border border-transparent bg-slate-50 px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#004A8F] focus:bg-white focus:ring-4 focus:ring-[#004A8F]/15"
                    />
                    <button
                        type="submit"
                        className="h-12 rounded-2xl bg-[#004A8F] px-6 text-sm font-semibold text-white hover:bg-[#003B73]"
                    >
                        Continuar
                    </button>
                </form>
            )}

            {enviando && (
                <p role="status" className="mt-4 text-sm text-slate-500">
                    Salvando...
                </p>
            )}

            {erro && (
                <p role="alert" className="mt-4 rounded-xl bg-tj-orange/10 px-4 py-3 text-sm text-[#A85A00]">
                    {erro}{' '}
                    <button type="button" onClick={() => enviar(respostas)} className="font-semibold underline">
                        Tentar de novo
                    </button>
                </p>
            )}

            {perguntaAtual > 0 && (
                <button
                    type="button"
                    onClick={voltar}
                    disabled={enviando}
                    className="mt-6 text-sm font-semibold text-slate-600 hover:text-[#00264D] disabled:opacity-60"
                >
                    ← Voltar
                </button>
            )}
        </Moldura>
    );
}
