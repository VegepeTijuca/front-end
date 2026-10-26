import { useState } from 'react';
import { Link } from 'react-router-dom';
import { salvarPreferencias } from '../services/usuarioService';

const perguntas = [
    {
        id: 'area',
        titulo: 'O que você gostaria de estudar?',
        opcoes: ['Tecnologia', 'Idiomas', 'Negócios', 'Desenvolvimento pessoal', 'Outro'],
    },
    {
        id: 'estilo',
        titulo: 'Como você prefere aprender?',
        opcoes: ['Vídeos', 'Textos', 'Exercícios práticos', 'Um pouco de cada'],
    },
    {
        id: 'tempo',
        titulo: 'Quanto tempo você pode estudar por dia?',
        opcoes: ['Até 15 minutos', 'De 15 a 30 minutos', 'De 30 a 60 minutos', 'Mais de 1 hora'],
    },
];

const cardClasses = 'mx-auto w-full max-w-xl rounded-2xl bg-white p-8 text-slate-800 shadow-[0_8px_30px_rgba(15,23,42,0.08)]';

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
            setErro('Não foi possível salvar suas preferências. Tente novamente.');
        } finally {
            setEnviando(false);
        }
    }

    function responder(valor, extra = {}) {
        const novas = { ...respostas, [pergunta.id]: valor, ...extra };
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
            <main className={cardClasses}>
                <h1 className="text-2xl font-bold text-[#0A1F4D]">Preferências concluídas!</h1>
                <p className="mt-2 text-slate-600">Suas respostas foram salvas para personalizar seus estudos.</p>
                <Link
                    to="/dashboard"
                    className="mt-6 inline-block rounded-xl bg-[#3349D6] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2a3dbb]"
                >
                    Ir para o painel
                </Link>
            </main>
        );
    }

    return (
        <main className={cardClasses}>
            <p className="text-sm text-slate-500">
                Pergunta {perguntaAtual + 1} de {perguntas.length}
            </p>
            <div
                role="progressbar"
                aria-label="Progresso das perguntas"
                aria-valuemin={0}
                aria-valuemax={perguntas.length}
                aria-valuenow={perguntaAtual + 1}
                className="mt-2 h-1.5 rounded-full bg-slate-200"
            >
                <div
                    className="h-full rounded-full bg-indigo-600 transition-[width] duration-200"
                    style={{ width: `${((perguntaAtual + 1) / perguntas.length) * 100}%` }}
                />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-[#0A1F4D]">{pergunta.titulo}</h1>

            <div className="mt-2">
                {pergunta.opcoes.map((opcao) => (
                    <button
                        key={opcao}
                        type="button"
                        disabled={enviando}
                        onClick={() => escolher(opcao)}
                        className={`mt-3 block w-full rounded-xl border px-4 py-3.5 text-left text-base transition hover:border-indigo-400 hover:bg-indigo-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 disabled:opacity-60 ${
                            respostas[pergunta.id] === opcao
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-slate-300 bg-white'
                        }`}
                    >
                        {opcao}
                    </button>
                ))}
            </div>

            {escolhendoOutro && (
                <form onSubmit={confirmarOutro} className="mt-4 flex gap-3">
                    <input
                        autoFocus
                        value={outro}
                        onChange={(e) => setOutro(e.target.value)}
                        placeholder="O que você quer estudar?"
                        aria-label="Outra área de estudo"
                        className="h-12 flex-1 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                    <button
                        type="submit"
                        className="h-12 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        Continuar
                    </button>
                </form>
            )}

            {enviando && <p role="status" className="mt-4 text-sm text-slate-500">Salvando...</p>}

            {erro && (
                <p role="alert" className="mt-4 text-sm text-red-600">
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
                    className="mt-6 text-sm font-semibold text-slate-600 hover:text-[#0A1F4D] disabled:opacity-60"
                >
                    ← Voltar
                </button>
            )}
        </main>
    );
}
