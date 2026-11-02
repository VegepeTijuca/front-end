import { useState } from 'react';
import { Link } from 'react-router-dom';
import { salvarPreferencias } from '../services/usuarioService';

/*
 * Perguntas do setup. Para adicionar/editar uma pergunta, mexa só neste array.
 *
 * - "api: true"  -> a resposta é enviada para a API (salvarPreferencias).
 *                   Mantenha o "valor" igual ao que o backend espera.
 * - "api: false" -> a resposta ainda NÃO tem rota na API: fica salva só neste navegador
 *                   (localStorage). Quando o backend tiver o campo, troque para "api: true".
 */
const perguntas = [
    {
        id: 'area',
        api: true,
        titulo: 'O que você gostaria de estudar?',
        ajuda: 'Escolha a área principal. Você pode estudar outras coisas depois.',
        opcoes: [
            { valor: 'Tecnologia', emoji: '💻', descricao: 'Programação, dados, redes e mais' },
            { valor: 'Idiomas', emoji: '🌎', descricao: 'Inglês, espanhol, japonês...' },
            { valor: 'Negócios', emoji: '📈', descricao: 'Gestão, finanças e empreendedorismo' },
            { valor: 'Desenvolvimento pessoal', emoji: '🌱', descricao: 'Hábitos, foco e carreira' },
            { valor: 'Outro', emoji: '✨', descricao: 'Conte para a gente o que é' },
        ],
    },
    {
        id: 'objetivo',
        api: false,
        titulo: 'Qual é o seu objetivo agora?',
        ajuda: 'Isso ajuda a entender o que você quer alcançar.',
        opcoes: [
            { valor: 'Passar em uma prova', emoji: '🎯', descricao: 'Vestibular, concurso, certificação' },
            { valor: 'Ir bem na escola ou faculdade', emoji: '🎓', descricao: 'Acompanhar as matérias do dia a dia' },
            { valor: 'Mudar ou crescer na carreira', emoji: '🚀', descricao: 'Aprender algo novo para o trabalho' },
            { valor: 'Aprender por curiosidade', emoji: '🔍', descricao: 'Sem pressão, no meu ritmo' },
        ],
    },
    {
        id: 'estilo',
        api: true,
        titulo: 'Como você prefere aprender?',
        ajuda: 'Pense no jeito em que você aprende mais rápido.',
        opcoes: [
            { valor: 'Vídeos', emoji: '🎬', descricao: 'Aulas e tutoriais em vídeo' },
            { valor: 'Textos', emoji: '📖', descricao: 'Livros, artigos e resumos' },
            { valor: 'Exercícios práticos', emoji: '🛠️', descricao: 'Aprender fazendo' },
            { valor: 'Um pouco de cada', emoji: '🔀', descricao: 'Misturar formatos' },
        ],
    },
    {
        id: 'tempo',
        api: true,
        titulo: 'Quanto tempo você pode estudar por dia?',
        ajuda: 'Seja realista: é melhor pouco todo dia do que muito de vez em quando.',
        opcoes: [
            { valor: 'Até 15 minutos', emoji: '⚡', descricao: 'Sessões rápidas' },
            { valor: 'De 15 a 30 minutos', emoji: '☕', descricao: 'O tempo de um café' },
            { valor: 'De 30 a 60 minutos', emoji: '⏱️', descricao: 'Uma sessão de foco' },
            { valor: 'Mais de 1 hora', emoji: '🔥', descricao: 'Estudo profundo' },
        ],
    },
    {
        id: 'periodo',
        api: false,
        titulo: 'Em que período do dia você rende mais?',
        ajuda: 'Vamos usar isso para sugerir bons horários de estudo.',
        opcoes: [
            { valor: 'Manhã', emoji: '🌅', descricao: 'Antes do meio-dia' },
            { valor: 'Tarde', emoji: '☀️', descricao: 'Do almoço até o fim da tarde' },
            { valor: 'Noite', emoji: '🌙', descricao: 'Depois do jantar' },
            { valor: 'Madrugada', emoji: '🦉', descricao: 'Quando tudo está silencioso' },
        ],
    },
];

const CHAVE_LOCAL = 'classme:preferencias-locais';

// guarda neste navegador as respostas que ainda não têm campo na API
function salvarLocal(dados) {
    try {
        localStorage.setItem(CHAVE_LOCAL, JSON.stringify(dados));
    } catch {
        /* sem localStorage (modo privado, etc.): segue sem salvar */
    }
}

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
                <div className="relative hidden flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_60%_18%,rgba(191,219,254,0.75),transparent_42%),radial-gradient(ellipse_at_55%_62%,#38bdf8,transparent_58%),linear-gradient(165deg,#3349D6,#1c2aa8_55%,#141d85)] p-10 text-white lg:flex">
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
                                    className={`flex min-h-40 flex-col justify-between rounded-3xl p-4 text-sm font-medium backdrop-blur ${
                                        passo.ativo ? 'bg-white text-slate-900' : 'bg-white/15 text-white/70'
                                    }`}
                                >
                                    <span
                                        className={`grid h-8 w-8 place-items-center rounded-full text-sm ${
                                            passo.ativo
                                                ? 'bg-[#3349D6] text-white'
                                                : passo.feito
                                                  ? 'bg-white/90 text-[#3349D6]'
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
                    <p className="text-3xl font-semibold tracking-tight text-[#3349D6] lg:hidden">clʌss.me</p>
                    <div className="flex flex-1 items-center py-8">
                        <div className="mx-auto w-full max-w-lg">{children}</div>
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
            // respostas sem campo na API ficam só neste navegador
            const local = {};
            const paraApi = {};
            perguntas.forEach(({ id, api }) => {
                if (dados[id] !== undefined) (api ? paraApi : local)[id] = dados[id];
            });
            if (dados.areaOutro) paraApi.areaOutro = dados.areaOutro;

            salvarLocal(local);
            await salvarPreferencias(paraApi);
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
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#3349D6]/10 text-3xl">
                        🎉
                    </span>
                    <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900">Tudo pronto!</h2>
                    <p className="mt-3 text-slate-500">
                        Suas respostas foram salvas. Agora é só começar a organizar seus estudos.
                    </p>
                    <Link
                        to="/dashboard"
                        className="mt-8 inline-block rounded-2xl bg-[#3349D6] px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#3349D6]/25 hover:bg-[#2a3dbb]"
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
                <p className="font-semibold text-[#3349D6]">
                    Pergunta {perguntaAtual + 1} de {perguntas.length}
                </p>
                <Link to="/dashboard" className="text-slate-500 hover:text-[#0A1F4D]">
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
                            i <= perguntaAtual ? 'bg-[#3349D6]' : 'bg-slate-200'
                        }`}
                    />
                ))}
            </div>

            <h1 className="mt-8 text-3xl font-semibold tracking-tight text-slate-900">{pergunta.titulo}</h1>
            <p className="mt-2 text-sm text-slate-500">{pergunta.ajuda}</p>

            <div className="mt-6 space-y-3">
                {pergunta.opcoes.map((opcao) => {
                    const selecionada =
                        respostas[pergunta.id] === opcao.valor || (opcao.valor === 'Outro' && escolhendoOutro);
                    return (
                        <button
                            key={opcao.valor}
                            type="button"
                            disabled={enviando}
                            onClick={() => escolher(opcao.valor)}
                            aria-pressed={selecionada}
                            className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition hover:border-[#3349D6] hover:bg-[#3349D6]/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#3349D6]/20 disabled:opacity-60 ${
                                selecionada ? 'border-[#3349D6] bg-[#3349D6]/5' : 'border-slate-200 bg-white'
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
                        className="h-12 flex-1 rounded-2xl border border-transparent bg-slate-50 px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#3349D6] focus:bg-white focus:ring-4 focus:ring-[#3349D6]/15"
                    />
                    <button
                        type="submit"
                        className="h-12 rounded-2xl bg-[#3349D6] px-6 text-sm font-semibold text-white hover:bg-[#2a3dbb]"
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
                <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
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
        </Moldura>
    );
}
