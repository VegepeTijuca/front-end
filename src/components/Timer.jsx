import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarTimers } from '../services/presetService';
import { TIMERS_SUGERIDOS } from '../data/presets';
import {
  atualizarSessao,
  buscarSessaoAtiva,
  criarSessao,
  removerSessao,
} from '../services/timerService';

const AVISO_SYNC =
  'Não foi possível salvar a sessão no servidor. O timer continua funcionando, mas pode não ser lembrado ao recarregar.';

// 'YYYY-MM-DDTHH:mm' no horário local, para usar como "min" do input
function agoraParaInput() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

// 'YYYY-MM-DDTHH:mm' de "agora + N minutos", no horário local
function emMinutos(min) {
  const d = new Date(Date.now() + min * 60000);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function Contador({ ms, cor }) {
  const unidades = [
    { label: 'dias', valor: Math.floor(ms / 86400000) },
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
          <div className="text-3xl font-bold tabular-nums transition-colors duration-500 sm:text-4xl" style={{ color: cor }}>
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
  const [data, setData] = useState('');
  const [fim, setFim] = useState(null); // momento final (ms)
  const [pausado, setPausado] = useState(false);
  const [restante, setRestante] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [timers, setTimers] = useState([]); // timers salvos em Preferências
  const [escolhido, setEscolhido] = useState(null); // id ou chave do timer usado
  const [pausaDepois, setPausaDepois] = useState(0); // minutos de pausa depois do foco
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
    setData(emMinutos(t.foco));
    setPausaDepois(t.pausa ?? 0);
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
    const alvo = new Date(data).getTime();

    if (Number.isNaN(alvo) || alvo <= Date.now()) {
      setErro('Escolha uma data e hora no futuro.');
      return;
    }
    comecar(nome.trim(), alvo);
  }

  function comecar(nomeLimpo, alvo) {
    setErro('');
    setNome(nomeLimpo);
    setFim(alvo);
    setRestante(alvo - Date.now());
    setPausado(false);
    setFinalizado(false);

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
  function iniciarPausa() {
    const min = pausaDepois;
    sincronizar((id) => removerSessao(id));
    sessaoRef.current = sessaoRef.current.then(() => null);
    setPausaDepois(0);
    comecar('Pausa', Date.now() + min * 60000);
  }

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
    setData('');
    setEscolhido(null);
    setPausaDepois(0);
  }

  const corDoTimer = finalizado ? '#00A651' : pausado ? '#F49624' : '#004A8F';

  const dataFinal = iniciado
    ? new Date(fim).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })
    : '';

  return (
    <section className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
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
              <Link to="/configuracoes#timers" className="text-xs font-semibold text-[#004A8F] hover:underline">
                {timers.length > 0 ? 'Editar' : 'Salvar os seus'}
              </Link>
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
              Focar até (data e hora)
            </label>
            <input
              id="timer-data"
              type="datetime-local"
              min={agoraParaInput()}
              value={data}
              onChange={(e) => {
                setData(e.target.value);
                setEscolhido(null);
                setPausaDepois(0);
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
          {/* cor do estado: azul = em andamento, laranja = pausado, verde = concluído */}
          <div className="flex justify-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-white transition-colors duration-500"
              style={{ background: corDoTimer }}
            >
              <span className={`h-2 w-2 rounded-full bg-white ${!pausado && !finalizado ? 'animate-pulse' : ''}`} />
              {finalizado ? 'Concluído' : pausado ? 'Pausado' : 'Em andamento'}
            </span>
          </div>

          <Contador ms={restante} cor={corDoTimer} />

          {finalizado && (
            <p role="status" className="animate-pop text-center font-semibold text-tj-green">
              Sessão concluída! Bom trabalho.
            </p>
          )}

          {finalizado && pausaDepois > 0 && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={iniciarPausa}
                className="rounded-xl border border-tj-green px-5 py-2.5 text-sm font-semibold text-[#007a3d] hover:bg-tj-green/10 active:scale-[0.98]"
              >
                Começar a pausa de {pausaDepois} min
              </button>
            </div>
          )}

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            {!finalizado && (
              <button
                type="button"
                onClick={pausado ? retomar : pausar}
                className={`rounded-xl px-5 py-3 font-semibold transition active:scale-[0.98] focus:outline-none focus:ring-4 ${
                  pausado
                    ? 'bg-[#004A8F] text-white hover:bg-[#003B73] focus:ring-[#004A8F]/20'
                    : 'border border-tj-orange bg-white text-[#b86a05] hover:bg-tj-orange/10 focus:ring-tj-orange/25'
                }`}
              >
                {pausado ? 'Retomar' : 'Pausar'}
              </button>
            )}
            <button
              type="button"
              onClick={encerrar}
              className="rounded-xl bg-[#00264D] px-5 py-3 font-semibold text-white transition hover:bg-[#003B73] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#00264D]/25"
            >
              Encerrar sessão
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
