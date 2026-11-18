import { useEffect, useRef, useState } from 'react';
import FormTimer from './FormTimer';
import { TIMERS_SUGERIDOS } from '../data/presets';
import { CircleCheck, Pause, Play } from 'lucide-react';
import {
  atualizarSessao,
  buscarSessaoAtiva,
  criarSessao,
  listarTimers,
  removerSessao,
} from '../services/timerService';

const AVISO_SYNC =
  'Não foi possível salvar a sessão no servidor. O timer continua funcionando, mas pode não ser lembrado ao recarregar.';

// 'HH:mm' no horário local, para usar no input type="time"
 function minutosParaInput(minutos) {
   const hh = String(Math.floor(minutos / 60)).padStart(2, '0');
   const mm = String(minutos % 60).padStart(2, '0');
   return `${hh}:${mm}`;
 }
 
 function inputParaMinutos(hora) {
   if (!hora || !/^\d{2}:\d{2}$/.test(hora)) return Number.NaN;
   const [hh, mm] = hora.split(':').map(Number);
   return hh * 60 + mm;
}

function Contador({ ms }) {
  const unidades = [
    { label: 'horas', valor: Math.floor((ms / 3600000) % 24) },
    { label: 'minutos', valor: Math.floor((ms / 60000) % 60) },
    { label: 'segundos', valor: Math.floor((ms / 1000) % 60) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {unidades.map(({ label, valor }) => (
        <div
          key={label}
          className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
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
  const [carregando, setCarregando] = useState(true);
  const [nome, setNome] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [data, setData] = useState('');
  const [duracaoPausa, setDuracaoPausa] = useState('00:05');
  const [fim, setFim] = useState(null); // momento final (ms)
  const [pausado, setPausado] = useState(false);
  const [restante, setRestante] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [timers, setTimers] = useState([]); // timers salvos em Preferências
  const [escolhido, setEscolhido] = useState(null); // id ou chave do timer usado
  const [pausaDepois, setPausaDepois] = useState(0); // minutos de pausa depois do foco
    const [emPausa, setEmPausa] = useState(false);
    const transicaoRef = useRef(false);
  const [modalTimerAberto, setModalTimerAberto] = useState(false);
  const [novoTimerNome, setNovoTimerNome] = useState('Meu timer');
  const [novoTimerFoco, setNovoTimerFoco] = useState(30);
  const [novoTimerPausa, setNovoTimerPausa] = useState(5);
  const padraoAplicado = useRef(false);

  // promessa com o id da sessão no servidor (null se não existe ou se falhou)
  const sessaoRef = useRef(Promise.resolve(null));

  const iniciado = fim !== null;

  // ao abrir, recupera a sessão em andamento (se houver)
  useEffect(() => {
    let cancelado = false;

    buscarSessaoAtiva()
      .then((sessao) => {
        if (cancelado || !sessao) return;
        const agora = Date.now();
        sessaoRef.current = Promise.resolve(sessao.id);
        setNome(sessao.nome);
        setObjetivo(sessao.nome === 'Pausa' ? '' : sessao.nome);
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

  // timers salvos: se houver um padrão, já deixa o formulário preenchido com ele
  useEffect(() => {
    let cancelado = false;
    listarTimers()
      .then((lista) => !cancelado && setTimers(lista))
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    if (padraoAplicado.current || carregando || iniciado) return;
    const padrao = timers.find((t) => t.padrao);
    if (!padrao) return;
    padraoAplicado.current = true;
    usarTimer(padrao);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timers, carregando, iniciado]);

  // preenche o formulário com um timer (salvo ou sugerido)
  function usarTimer(t) {
    setEscolhido(t.id ?? t.chave);
    setData(minutosParaInput(t.foco));
    setPausaDepois(t.pausa ?? 0);
    setDuracaoPausa(minutosParaInput(t.pausa ?? 0));
  }

  function criarTimerPersonalizado(e) {
    e.preventDefault();
    const timer = {
      chave: `personalizado-${Date.now()}`,
      nome: novoTimerNome.trim(),
      foco: Number(novoTimerFoco),
      pausa: Number(novoTimerPausa),
    };
    setTimers((atuais) => [...atuais, timer]);
    usarTimer(timer);
    setModalTimerAberto(false);
  }

  // contagem regressiva
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

  // título da aba (restaura o original ao parar)
  useEffect(() => {
    if (!iniciado || !nome) return;
    const anterior = document.title;
    document.title = nome;
    return () => {
      document.title = anterior;
    };
  }, [iniciado, nome]);

  // executa uma operação no servidor em ordem, sem travar a tela se falhar
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

  function iniciar(e) {
    e.preventDefault();
    const foco = inputParaMinutos(data);
    const pausa = inputParaMinutos(duracaoPausa);

    if (!Number.isFinite(foco) || foco <= 0 || !Number.isFinite(pausa)) {
      setErro('Informe uma duração de foco e descanso válida.');
      return;
    }
    setObjetivo(nome.trim());
    setPausaDepois(pausa);
    setEmPausa(false);
    comecar(nome.trim(), Date.now() + foco * 60000);
  }

  function comecar(nomeLimpo, alvo) {
    setErro('');
    setNome(nomeLimpo);
    setFim(alvo);
    setRestante(alvo - Date.now());
    setPausado(false);
    setFinalizado(false);
  transicaoRef.current = false;

    sessaoRef.current = criarSessao({ nome: nomeLimpo, fim: alvo })
      .then((sessao) => {
        setAviso('');
        return sessao.id;
      })
      .catch(() => {
        setAviso(AVISO_SYNC);
        return null;
      });
  }

  // depois do foco: troca a sessão pela pausa do timer escolhido
  // Ao terminar uma fase, inicia automaticamente a outra.
  function alternarFase() {
    const proximaPausa = !emPausa;
    const min = proximaPausa ? pausaDepois : inputParaMinutos(data);
    if (min <= 0) return;
    sincronizar((id) => removerSessao(id));
    sessaoRef.current = sessaoRef.current.then(() => null);
    setEmPausa(proximaPausa);
    comecar(proximaPausa ? 'Pausa' : objetivo, Date.now() + min * 60000);
  }

  useEffect(() => {
    if (!finalizado || !iniciado || pausaDepois <= 0 || transicaoRef.current) return;
    transicaoRef.current = true;
    alternarFase();
  }, [finalizado, iniciado, pausaDepois]);

  function pausar() {
    setPausado(true);
    sincronizar((id) => atualizarSessao(id, { pausado: true, restante }));
  }

  function retomar() {
    const novoFim = Date.now() + restante;
    setFim(novoFim);
    setPausado(false);
    sincronizar((id) => atualizarSessao(id, { pausado: false, fim: novoFim }));
  }

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
    setPausaDepois(0);
    setEmPausa(false);
              {iniciado ? (emPausa ? 'Descanso' : nome) : 'Timer de estudo'}
              <p className="mt-2 text-sm text-slate-500">
                Informe as durações de foco e descanso. O timer alterna entre elas até encerrar.
              </p>
  }


  const dataFinal = iniciado
    ? new Date(fim).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })
    : '';

  return (
    <section className={`mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 p-6 shadow-sm transition-colors duration-700 ease-in-out sm:p-8 ${emPausa ? 'bg-emera0ld-5' : 'bg-slate-50'}`}>
      <header className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#004A8F]">
          Sessão de estudo
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          {iniciado ? nome : 'Timer de estudo'}
        </h2>
        {iniciado ? (
          <p className="mt-2 text-sm text-slate-500">Até {dataFinal}</p>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            Diga o que vai estudar e até quando quer focar. A contagem regressiva começa ao iniciar.
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
                className="text-xs font-semibold text-[#004A8F] hover:underline"
              >
                Criar timer
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
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition active:scale-95 ${
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
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#004A8F] focus:ring-4 focus:ring-[#004A8F]/10"
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
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#004A8F] focus:ring-4 focus:ring-[#004A8F]/10"
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
                setPausaDepois(inputParaMinutos(e.target.value) || 0);
                setEscolhido(null);
              }}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#004A8F] focus:ring-4 focus:ring-[#004A8F]/10"
            />
          </div>

          {erro && (
            <p role="alert" className="text-sm text-[#A85A00]">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#004A8F] px-5 py-3 font-semibold text-white shadow-sm transition active:scale-[0.98] hover:bg-[#003B73] focus:outline-none focus:ring-4 focus:ring-[#004A8F]/20"
          >
            Iniciar estudos
          </button>
        </form>
      ) : (
        <div className="space-y-7">
          {/* o estado aparece escrito; a cor não muda com ele */}
          <div className="flex justify-center">
              <span
                role="status"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-1.5 text-sm font-semibold text-white"
            >
              {finalizado ? <CircleCheck className="h-4 w-4" /> : pausado ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {finalizado ? 'Concluído' : pausado ? 'Pausado' : 'Em andamento'}
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
                className={`rounded-xl px-5 py-3 font-semibold transition active:scale-[0.98] focus:outline-none focus:ring-4 ${
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
              className="rounded-xl bg-navy px-5 py-3 font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-navy/25"
            >
              Encerrar sessão
            </button>
          </div>
        </div>
      )}

      <FormTimer
        aberto={modalTimerAberto}
        onFechar={() => setModalTimerAberto(false)}
      />
    </section>
  );
}
