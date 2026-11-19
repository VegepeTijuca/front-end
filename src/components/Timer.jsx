import { useEffect, useRef, useState } from 'react';
import FormTimer from './FormTimer';
import { TIMERS_SUGERIDOS } from '../data/presets';
import { CircleCheck, Pause, Play } from 'lucide-react';
import {
  atualizarSessao,
  buscarSessaoAtiva,
  criarSessao,
  criarTimer,
  definirTimerPadrao,
  listarTimers,
  removerSessao,
  removerTimer,
} from '../services/timerService';

// Mostrado quando não conseguimos gravar a sessão (o timer continua funcionando).
const AVISO_SYNC =
  'Não foi possível salvar a sessão. O timer continua funcionando, mas pode não ser lembrado ao recarregar.';

// Converte minutos em 'HH:mm', formato do <input type="time">.
function minutosParaInput(minutos) {
  const hh = String(Math.floor(minutos / 60)).padStart(2, '0');
  const mm = String(minutos % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

// Converte 'HH:mm' em minutos. Devolve NaN se o valor for inválido.
function inputParaMinutos(hora) {
  if (!hora || !/^\d{2}:\d{2}$/.test(hora)) return Number.NaN;
  const [hh, mm] = hora.split(':').map(Number);
  return hh * 60 + mm;
}

// Mostra o tempo restante em horas, minutos e segundos.
function Contador({ ms }) {
  // Arredonda para cima: assim o primeiro segundo mostra 25:00 (e não 24:59)
  // e o zero só aparece quando o tempo realmente acabou.
  const total = Math.max(0, Math.ceil(ms / 1000));
  const unidades = [
    { label: 'horas', valor: Math.floor(total / 3600) },
    { label: 'minutos', valor: Math.floor((total % 3600) / 60) },
    { label: 'segundos', valor: total % 60 },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {unidades.map(({ label, valor }) => (
        <div
          key={label}
          className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
        >
          <div className="text-3xl font-bold tabular-nums text-navy sm:text-4xl">
            {String(valor).padStart(2, '0')}
          </div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Timer() {
  // ---------- formulário ----------
  const [carregando, setCarregando] = useState(true);
  const [nome, setNome] = useState(''); // objetivo digitado (ou "Pausa" durante o descanso)
  const [data, setData] = useState(''); // duração do foco, em 'HH:mm'
  const [duracaoPausa, setDuracaoPausa] = useState('00:05'); // duração do descanso, em 'HH:mm'
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [timers, setTimers] = useState([]); // timers salvos pelo usuário
  const [escolhido, setEscolhido] = useState(null); // id ou chave do timer selecionado
  const [modalTimerAberto, setModalTimerAberto] = useState(false);
  const padraoAplicado = useRef(false);

  // ---------- sessão em andamento ----------
  const [fim, setFim] = useState(null); // momento final da fase atual (ms)
  const [pausado, setPausado] = useState(false);
  const [restante, setRestante] = useState(0); // ms que faltam na fase atual
  const [finalizado, setFinalizado] = useState(false);
  const [objetivo, setObjetivo] = useState(''); // o que está sendo estudado (sobrevive ao descanso)
  const [focoMin, setFocoMin] = useState(0); // minutos de foco de cada ciclo
  const [pausaDepois, setPausaDepois] = useState(0); // minutos de descanso de cada ciclo
  const [emPausa, setEmPausa] = useState(false); // true durante o descanso
  const transicaoRef = useRef(false); // impede iniciar a próxima fase duas vezes

  // Promessa com o id da sessão salva (null se não existe ou se falhou).
  // Encadeamos as operações nela para que aconteçam sempre em ordem.
  const sessaoRef = useRef(Promise.resolve(null));

  const iniciado = fim !== null;

  // Ao abrir, recupera a sessão em andamento (se houver).
  useEffect(() => {
    let cancelado = false;

    buscarSessaoAtiva()
      .then((sessao) => {
        if (cancelado || !sessao) return;
        const agora = Date.now();
        sessaoRef.current = Promise.resolve(sessao.id);
        setNome(sessao.nome);
        setObjetivo(sessao.objetivo);
        setFocoMin(sessao.focoMin);
        setPausaDepois(sessao.pausaDepois);
        setEmPausa(sessao.emPausa);
        setFim(sessao.fim ?? agora);
        setPausado(sessao.pausado);
        setRestante(sessao.pausado ? sessao.restante : Math.max(0, sessao.fim - agora));
        setFinalizado(!sessao.pausado && sessao.fim !== null && sessao.fim <= agora);
      })
      .catch(() => {
        if (!cancelado) setAviso('Não foi possível carregar sua sessão de estudo.');
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  // Carrega os timers salvos do usuário.
  useEffect(() => {
    let cancelado = false;
    listarTimers()
      .then((lista) => !cancelado && setTimers(lista))
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, []);

  // Se existir um timer padrão, deixa o formulário já preenchido com ele (uma única vez).
  useEffect(() => {
    if (padraoAplicado.current || carregando || iniciado) return;
    const padrao = timers.find((t) => t.padrao);
    if (!padrao) return;
    padraoAplicado.current = true;
    usarTimer(padrao);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timers, carregando, iniciado]);

  // Preenche o formulário com um timer (salvo ou sugerido).
  function usarTimer(t) {
    setEscolhido(t.id ?? t.chave);
    setData(minutosParaInput(t.foco));
    setDuracaoPausa(minutosParaInput(t.pausa ?? 0));
  }

  // Ao fechar o modal de timers, atualiza a lista de atalhos (podem ter criado/removido).
  function fecharModalTimers() {
    setModalTimerAberto(false);
    listarTimers()
      .then((lista) => {
        setTimers(lista);
        // se o timer selecionado foi removido, desmarca o atalho
        setEscolhido((atual) => (lista.some((t) => t.id === atual) ? atual : null));
      })
      .catch(() => {});
  }

  // Contagem regressiva: recalcula a cada segundo a partir do horário final,
  // então continua correta mesmo se a aba ficar em segundo plano.
  useEffect(() => {
    if (!iniciado || pausado || finalizado) return;

    const id = setInterval(() => {
      const falta = fim - Date.now();
      if (falta <= 0) {
        setRestante(0);
        setFinalizado(true);
      } else {
        setRestante(falta);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [iniciado, pausado, finalizado, fim]);

  // Título da aba mostra a fase atual (e volta ao original ao parar).
  const tituloFase = emPausa ? 'Descanso' : nome;
  useEffect(() => {
    if (!iniciado || !tituloFase) return;
    const anterior = document.title;
    document.title = tituloFase;
    return () => {
      document.title = anterior;
    };
  }, [iniciado, tituloFase]);

  // Executa uma operação na sessão salva, em ordem, sem travar a tela se falhar.
  function sincronizar(operacao) {
    sessaoRef.current = sessaoRef.current.then(async (id) => {
      if (!id) return id;
      try {
        await operacao(id);
        setAviso('');
      } catch {
        setAviso(AVISO_SYNC);
      }
      return id;
    });
  }

  // Valida o formulário e começa o primeiro ciclo de foco.
  function iniciar(e) {
    e.preventDefault();
    const foco = inputParaMinutos(data);
    const pausa = inputParaMinutos(duracaoPausa);

    if (!Number.isFinite(foco) || foco <= 0 || !Number.isFinite(pausa)) {
      setErro('Informe uma duração de foco e de descanso válida.');
      return;
    }

    const objetivoLimpo = nome.trim();
    setObjetivo(objetivoLimpo);
    setFocoMin(foco);
    setPausaDepois(pausa);
    setEmPausa(false);
    comecar(objetivoLimpo, Date.now() + foco * 60000, {
      objetivo: objetivoLimpo,
      focoMin: foco,
      pausaDepois: pausa,
      emPausa: false,
    });
  }

  // Inicia uma fase (foco ou descanso) e a grava como sessão ativa.
  // "extras" guarda o contexto do ciclo para que ele sobreviva a um recarregamento.
  function comecar(nomeFase, alvo, extras) {
    setErro('');
    setNome(nomeFase);
    setFim(alvo);
    setRestante(alvo - Date.now());
    setPausado(false);
    setFinalizado(false);
    transicaoRef.current = false;

    sessaoRef.current = criarSessao({ nome: nomeFase, fim: alvo, ...extras })
      .then((sessao) => {
        setAviso('');
        return sessao.id;
      })
      .catch(() => {
        setAviso(AVISO_SYNC);
        return null;
      });
  }

  // Ao terminar uma fase, inicia automaticamente a outra (foco ⇄ descanso).
  // A nova sessão substitui a anterior, então não é preciso removê-la antes.
  function alternarFase() {
    const proximaEmPausa = !emPausa;
    const minutos = proximaEmPausa ? pausaDepois : focoMin;
    if (!(minutos > 0)) return;

    setEmPausa(proximaEmPausa);
    comecar(proximaEmPausa ? 'Pausa' : objetivo, Date.now() + minutos * 60000, {
      objetivo,
      focoMin,
      pausaDepois,
      emPausa: proximaEmPausa,
    });
  }

  // Quando a fase termina e há descanso configurado, troca de fase sozinho.
  // Sem descanso (0 min), o timer apenas mostra "Concluído".
  useEffect(() => {
    if (!finalizado || !iniciado || pausaDepois <= 0 || transicaoRef.current) return;
    transicaoRef.current = true;
    alternarFase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalizado, iniciado, pausaDepois]);

  function pausar() {
    // Calcula o que falta agora (e não o valor do último "tique"), para não perder até 1s.
    const falta = Math.max(0, fim - Date.now());
    setRestante(falta);
    setPausado(true);
    sincronizar((id) => atualizarSessao(id, { pausado: true, restante: falta }));
  }

  function retomar() {
    const novoFim = Date.now() + restante;
    setFim(novoFim);
    setPausado(false);
    sincronizar((id) => atualizarSessao(id, { pausado: false, fim: novoFim }));
  }

  // Encerra a sessão e volta o formulário ao estado inicial.
  function encerrar() {
    sincronizar((id) => removerSessao(id));
    sessaoRef.current = sessaoRef.current.then(() => null);

    setFim(null);
    setPausado(false);
    setFinalizado(false);
    setRestante(0);
    setNome('');
    setObjetivo('');
    setData('');
    setDuracaoPausa('00:05');
    setEscolhido(null);
    setFocoMin(0);
    setPausaDepois(0);
    setEmPausa(false);
  }

  const dataFinal = iniciado
    ? new Date(fim).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })
    : '';

  return (
    <section
      className={`mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 p-6 shadow-sm transition-colors duration-700 ease-in-out sm:p-8 ${
        emPausa ? 'bg-emerald-50' : 'bg-slate-50'
      }`}
    >
      <header className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#004A8F]">
          {emPausa ? 'Hora do descanso' : 'Sessão de estudo'}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          {iniciado ? (emPausa ? 'Descanso' : nome) : 'Timer de estudo'}
        </h2>
        {iniciado ? (
          <p className="mt-2 text-sm text-slate-500">Até {dataFinal}</p>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            Informe as durações de foco e descanso. O timer alterna entre elas até você encerrar.
          </p>
        )}
      </header>

      {aviso && (
        <p role="status" className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {aviso}
        </p>
      )}

      {carregando ? (
        <p className="text-center text-sm text-slate-500">Carregando...</p>
      ) : !iniciado ? (
        <form className="space-y-5" onSubmit={iniciar}>
          <div>
            <p className="mb-2 flex items-baseline justify-between gap-2 text-sm font-medium text-slate-700">
              {timers.length > 0 ? 'Seus timers' : 'Duração rápida'}
              <button
                type="button"
                onClick={() => setModalTimerAberto(true)}
                className="text-xs font-semibold text-[#004A8F] hover:underline cursor-pointer disabled:cursor-not-allowed"
              >
                Gerenciar timers
              </button>
            </p>
            <div className="flex flex-wrap gap-2">
              {(timers.length > 0 ? timers : TIMERS_SUGERIDOS).map((t) => {
                const ativo = escolhido === (t.id ?? t.chave);
                return (
                  <button
                    key={t.id ?? t.chave}
                    type="button"
                    onClick={() => usarTimer(t)}
                    aria-pressed={ativo}
                    className={`cursor-pointer disabled:cursor-not-allowed rounded-full border px-3.5 py-1.5 text-sm font-semibold transition active:scale-95 ${
                      ativo
                        ? 'border-[#004A8F] bg-[#004A8F] text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-[#004A8F]/50'
                    }`}
                  >
                    {t.nome} <span className={ativo ? 'text-white/70' : 'text-slate-400'}>{t.foco} min</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="timer-titulo" className="mb-2 block text-sm font-medium text-slate-700">
              Objetivo de estudo
            </label>
            <input
              id="timer-titulo"
              type="text"
              placeholder="ex.: Revisar notas de biologia"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#004A8F] focus:ring-4 focus:ring-[#004A8F]/10 cursor-text disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="timer-data" className="mb-2 block text-sm font-medium text-slate-700">
              Foco (horas:minutos)
            </label>
            <input
              id="timer-data"
              type="time"
              step="60"
              value={data}
              onChange={(e) => {
                setData(e.target.value);
                setEscolhido(null);
              }}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#004A8F] focus:ring-4 focus:ring-[#004A8F]/10 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="timer-pausa" className="mb-2 block text-sm font-medium text-slate-700">
              Descanso (horas:minutos)
            </label>
            <input
              id="timer-pausa"
              type="time"
              step="60"
              value={duracaoPausa}
              onChange={(e) => {
                setDuracaoPausa(e.target.value);
                setEscolhido(null);
              }}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#004A8F] focus:ring-4 focus:ring-[#004A8F]/10 cursor-pointer disabled:cursor-not-allowed"
            />
            <p className="mt-1.5 text-xs text-slate-500">Use 00:00 para estudar sem descanso.</p>
          </div>

          {erro && (
            <p role="alert" className="text-sm text-[#A85A00]">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#004A8F] px-5 py-3 font-semibold text-white shadow-sm transition active:scale-[0.98] hover:bg-[#003B73] focus:outline-none focus:ring-4 focus:ring-[#004A8F]/20 cursor-pointer disabled:cursor-not-allowed"
          >
            Iniciar estudos
          </button>
        </form>
      ) : (
        <div className="space-y-7">
          {/* O estado aparece escrito; a cor do selo não muda com ele. */}
          <div className="flex justify-center">
            <span
              role="status"
              className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-1.5 text-sm font-semibold text-white"
            >
              {finalizado ? <CircleCheck className="h-4 w-4" /> : pausado ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {finalizado ? 'Concluído' : pausado ? 'Pausado' : emPausa ? 'Descansando' : 'Em andamento'}
            </span>
          </div>

          <Contador ms={restante} />

          {finalizado && (
            <p role="status" className="animate-pop text-center font-semibold text-slate-800">
              Sessão concluída! Bom trabalho.
            </p>
          )}

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            {!finalizado && (
              <button
                type="button"
                onClick={pausado ? retomar : pausar}
                className={`cursor-pointer disabled:cursor-not-allowed rounded-xl px-5 py-3 font-semibold transition active:scale-[0.98] focus:outline-none focus:ring-4 ${
                  pausado
                    ? 'bg-[#004A8F] text-white hover:bg-brand-dark focus:ring-[#004A8F]/20'
                    : 'border border-[#004A8F] bg-white text-[#004A8F] hover:bg-[#004A8F]/5 focus:ring-[#004A8F]/20'
                }`}
              >
                {pausado ? 'Retomar' : 'Pausar'}
              </button>
            )}
            <button
              type="button"
              onClick={encerrar}
              className="rounded-xl bg-navy px-5 py-3 font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-navy/25 cursor-pointer disabled:cursor-not-allowed"
            >
              Encerrar sessão
            </button>
          </div>
        </div>
      )}

      {/* Modal para criar, remover e escolher o timer padrão. */}
      <FormTimer
        aberto={modalTimerAberto}
        onFechar={fecharModalTimers}
        listarTimers={listarTimers}
        criarTimer={criarTimer}
        removerTimer={removerTimer}
        definirTimerPadrao={definirTimerPadrao}
      />
    </section>
  );
}
