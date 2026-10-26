import { useEffect, useRef, useState } from 'react';
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

function Contador({ ms }) {
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
          className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
        >
          <div className="text-3xl font-bold tabular-nums text-indigo-600 sm:text-4xl">
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

    const nomeLimpo = nome.trim();
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
  }

  const dataFinal = iniciado
    ? new Date(fim).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })
    : '';

  return (
    <section className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-lg shadow-slate-200/60 sm:p-8">
      <header className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Sessão de estudo
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          {iniciado ? nome : 'Timer de estudo'}
        </h2>
        {iniciado && <p className="mt-2 text-sm text-slate-500">Até {dataFinal}</p>}
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
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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
              onChange={(e) => setData(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {erro && (
            <p role="alert" className="text-sm text-red-600">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
          >
            Iniciar estudos
          </button>
        </form>
      ) : (
        <div className="space-y-7">
          <Contador ms={restante} />

          {finalizado && (
            <p role="status" className="text-center font-semibold text-indigo-600">
              Sessão concluída! Bom trabalho.
            </p>
          )}

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            {!finalizado && (
              <button
                type="button"
                onClick={pausado ? retomar : pausar}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                {pausado ? 'Retomar' : 'Pausar'}
              </button>
            )}
            <button
              type="button"
              onClick={encerrar}
              className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-300"
            >
              Encerrar sessão
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
