import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { apagarDadosLocais } from '../services/visitante';
import { lerPreferencias, salvarPreferencias } from '../services/usuarioService';
import {
  adicionarPacote,
  criarTimer,
  definirTimerPadrao,
  listarTimers,
  removerTimer,
} from '../services/presetService';
import { perguntas } from '../data/perguntas';
import { PACOTES_MATERIAS, TIMERS_SUGERIDOS } from '../data/presets';
import { EVENTO_TOUR } from '../components/TourInicial';

// ---------- preferências: o que vai para a API e o que fica só no navegador ----------
const CHAVE_LOCAL = 'classme:preferencias-locais';

function lerLocalPrefs() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_LOCAL)) ?? {};
  } catch {
    return {};
  }
}

// ---------- peças da página ----------

// Seção em duas colunas: título e explicação à esquerda, conteúdo à direita.
function Secao({ id, numero, titulo, texto, children, atraso = 0 }) {
  return (
    <section
      id={id}
      style={{ animationDelay: `${atraso}ms` }}
      className="grid scroll-mt-6 animate-fade-up gap-6 border-t border-slate-200 py-10 md:grid-cols-[230px_1fr] md:gap-10"
    >
      <header>
        <p className="text-sm font-bold tabular-nums text-tj-orange">{numero}</p>
        <h2 className="mt-1 text-2xl font-bold text-[#00264D]">{titulo}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{texto}</p>
      </header>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function Chip({ ativo, children, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={ativo}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-60 ${
        ativo
          ? 'border-[#004A8F] bg-[#004A8F] text-white'
          : 'border-slate-300 bg-white text-slate-700 hover:border-[#004A8F]/60 hover:text-[#004A8F]'
      }`}
    >
      {children}
    </button>
  );
}

const botaoPrimario =
  'rounded-xl bg-[#004A8F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003B73] active:scale-[0.98] disabled:opacity-60';
const botaoLinha =
  'rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-[#004A8F] transition hover:bg-[#004A8F]/5 active:scale-[0.98] disabled:opacity-60';
const campo =
  'h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#004A8F] focus:ring-2 focus:ring-[#004A8F]/20';

// ---------- 02: como você estuda ----------
function SecaoEstudo({ prefs, aoSalvar }) {
  const [salvo, setSalvo] = useState('');
  const [erro, setErro] = useState('');
  const [outro, setOutro] = useState(prefs.areaOutro ?? '');
  const [editandoOutro, setEditandoOutro] = useState(false);

  async function escolher(id, valor, extra = {}) {
    setErro('');
    try {
      await aoSalvar({ [id]: valor, ...extra }, id === 'area' && valor !== 'Outro');
      setSalvo(id);
      setTimeout(() => setSalvo((atual) => (atual === id ? '' : atual)), 1800);
    } catch {
      setErro('Não foi possível salvar. Tente de novo.');
    }
  }

  return (
    <div className="space-y-7">
      {perguntas.map((p) => (
        <div key={p.id}>
          <div className="flex items-baseline gap-3">
            <h3 className="font-semibold text-slate-800">{p.titulo}</h3>
            <span
              className={`text-xs font-semibold text-tj-green transition-opacity duration-300 ${
                salvo === p.id ? 'opacity-100' : 'opacity-0'
              }`}
              aria-live="polite"
            >
              {salvo === p.id ? 'Salvo' : ''}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.opcoes.map((o) => (
              <Chip
                key={o.valor}
                ativo={prefs[p.id] === o.valor}
                onClick={() => {
                  if (o.valor === 'Outro') {
                    setEditandoOutro(true);
                    return;
                  }
                  setEditandoOutro(false);
                  escolher(p.id, o.valor);
                }}
              >
                {o.valor}
              </Chip>
            ))}
          </div>

          {p.id === 'area' && (editandoOutro || prefs.area === 'Outro') && (
            <form
              className="mt-3 flex max-w-md animate-fade-in gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!outro.trim()) return;
                setEditandoOutro(false);
                escolher('area', 'Outro', { areaOutro: outro.trim() });
              }}
            >
              <input
                value={outro}
                onChange={(e) => setOutro(e.target.value)}
                placeholder="O que você quer estudar?"
                aria-label="Outra área de estudo"
                className={campo}
              />
              <button type="submit" className={botaoLinha}>
                Salvar
              </button>
            </form>
          )}
        </div>
      ))}

      {erro && (
        <p role="alert" className="text-sm text-[#A85A00]">
          {erro}
        </p>
      )}
    </div>
  );
}

// ---------- 03: timers ----------
function SecaoTimers({ prefs }) {
  const [timers, setTimers] = useState([]);
  const [erro, setErro] = useState('');
  const [nome, setNome] = useState('');
  const [foco, setFoco] = useState('25');
  const [pausa, setPausa] = useState('5');

  useEffect(() => {
    let cancelado = false;
    listarTimers()
      .then((l) => !cancelado && setTimers(l))
      .catch(() => !cancelado && setErro('Não foi possível carregar seus timers.'));
    return () => {
      cancelado = true;
    };
  }, []);

  async function adicionar(dados) {
    setErro('');
    try {
      const novo = await criarTimer(dados);
      setTimers((l) => [...l, novo]);
      return true;
    } catch {
      setErro('Não foi possível salvar o timer.');
      return false;
    }
  }

  async function remover(id) {
    const anterior = timers;
    setTimers((l) => l.filter((t) => t.id !== id));
    try {
      await removerTimer(id);
    } catch {
      setTimers(anterior);
      setErro('Não foi possível remover o timer.');
    }
  }

  async function tornarPadrao(id) {
    const anterior = timers;
    setTimers((l) => l.map((t) => ({ ...t, padrao: t.id === id })));
    try {
      await definirTimerPadrao(id);
    } catch {
      setTimers(anterior);
      setErro('Não foi possível mudar o timer padrão.');
    }
  }

  async function criar(e) {
    e.preventDefault();
    const f = Number(foco);
    const p = Number(pausa || 0);
    if (!nome.trim() || !(f >= 1) || p < 0) {
      setErro('Dê um nome e informe os minutos de foco.');
      return;
    }
    if (await adicionar({ nome: nome.trim(), foco: f, pausa: p })) setNome('');
  }

  const jaTem = (s) => timers.some((t) => t.nome === s.nome && t.foco === s.foco);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-slate-800">Seus timers</h3>
        <p className="mt-1 text-sm text-slate-500">
          Aparecem como atalhos no timer da Visão Geral. O padrão já vem escolhido quando você abre o app.
        </p>

        {timers.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Você ainda não salvou nenhum. Escolha uma sugestão abaixo ou crie o seu.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            {timers.map((t) => (
              <li key={t.id} className="flex animate-fade-up flex-wrap items-center gap-x-4 gap-y-1 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">
                    {t.nome}
                    {t.padrao && (
                      <span className="ml-2 rounded-full bg-tj-yellow/40 px-2 py-0.5 text-xs font-bold text-[#6b5400]">
                        padrão
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-slate-500">
                    {t.foco} min de foco{t.pausa > 0 ? `, ${t.pausa} min de pausa` : ', sem pausa'}
                  </p>
                </div>
                {!t.padrao && (
                  <button type="button" onClick={() => tornarPadrao(t.id)} className="text-sm font-semibold text-[#004A8F] hover:underline">
                    Tornar padrão
                  </button>
                )}
                <button type="button" onClick={() => remover(t.id)} className="text-sm font-semibold text-slate-500 hover:text-slate-800">
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-slate-800">Sugestões</h3>
        <ul className="mt-3 space-y-3">
          {TIMERS_SUGERIDOS.map((s) => {
            const combina = prefs.tempo === s.tempo;
            return (
              <li key={s.chave} className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">
                    {s.nome} <span className="font-normal text-slate-500">{s.foco} + {s.pausa} min</span>
                    {combina && <span className="ml-2 text-xs font-bold text-tj-green">combina com o seu tempo diário</span>}
                  </p>
                  <p className="text-sm text-slate-500">{s.descricao}</p>
                </div>
                <button
                  type="button"
                  disabled={jaTem(s)}
                  onClick={() => adicionar({ nome: s.nome, foco: s.foco, pausa: s.pausa })}
                  className={botaoLinha}
                >
                  {jaTem(s) ? 'Salvo' : 'Salvar'}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <form onSubmit={criar}>
        <h3 className="font-semibold text-slate-800">Criar o seu</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_110px_110px_auto]">
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome (ex.: Revisão)" aria-label="Nome do timer" className={campo} />
          <input type="number" min="1" value={foco} onChange={(e) => setFoco(e.target.value)} aria-label="Minutos de foco" title="Minutos de foco" className={campo} />
          <input type="number" min="0" value={pausa} onChange={(e) => setPausa(e.target.value)} aria-label="Minutos de pausa" title="Minutos de pausa" className={campo} />
          <button type="submit" className={botaoPrimario}>
            Salvar
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">Foco e pausa em minutos. Com pausa zero, não aparece o botão de pausa no fim.</p>
      </form>

      {erro && (
        <p role="alert" className="text-sm text-[#A85A00]">
          {erro}
        </p>
      )}
    </div>
  );
}

// ---------- 04: matérias prontas ----------
function SecaoMaterias({ prefs }) {
  const [feitos, setFeitos] = useState({}); // chave do pacote -> quantas disciplinas criou
  const [ocupado, setOcupado] = useState('');
  const [abertos, setAbertos] = useState({});
  const [erro, setErro] = useState('');

  const respostas = useMemo(() => Object.values(prefs).filter(Boolean), [prefs]);
  const ordenados = useMemo(() => {
    const combina = (p) => p.combina.some((c) => respostas.includes(c));
    return [...PACOTES_MATERIAS].sort((a, b) => Number(combina(b)) - Number(combina(a)));
  }, [respostas]);

  async function adicionar(pacote) {
    setOcupado(pacote.chave);
    setErro('');
    try {
      const n = await adicionarPacote(pacote);
      setFeitos((f) => ({ ...f, [pacote.chave]: n }));
    } catch {
      setErro('Não foi possível adicionar. Algumas disciplinas podem ter sido criadas.');
    } finally {
      setOcupado('');
    }
  }

  return (
    <div>
      <ul className="divide-y divide-slate-200 border-y border-slate-200">
        {ordenados.map((p) => {
          const combina = p.combina.some((c) => respostas.includes(c));
          const feito = feitos[p.chave];
          const aberto = abertos[p.chave];
          return (
            <li key={p.chave} className="py-5">
              <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-800">
                    {p.nome}
                    {combina && <span className="ml-2 text-xs font-bold text-tj-green">combina com suas respostas</span>}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-500">{p.descricao}</p>
                  <p className="mt-2 text-sm text-slate-700">{p.materias.map((m) => m.nome).join(', ')}.</p>
                  <button
                    type="button"
                    onClick={() => setAbertos((a) => ({ ...a, [p.chave]: !a[p.chave] }))}
                    aria-expanded={Boolean(aberto)}
                    className="mt-2 text-sm font-semibold text-[#004A8F] hover:underline"
                  >
                    {aberto ? 'Esconder conteúdos' : 'Ver conteúdos'}
                  </button>
                </div>

                {feito === undefined ? (
                  <button type="button" disabled={ocupado === p.chave} onClick={() => adicionar(p)} className={botaoLinha}>
                    {ocupado === p.chave ? 'Adicionando...' : 'Adicionar às disciplinas'}
                  </button>
                ) : (
                  <p className="animate-pop text-sm font-semibold text-tj-green">
                    {feito > 0 ? `${feito} disciplina${feito > 1 ? 's' : ''} adicionada${feito > 1 ? 's' : ''}.` : 'Você já tinha todas.'}{' '}
                    <Link to="/disciplinas" className="text-[#004A8F] underline">
                      Ver
                    </Link>
                  </p>
                )}
              </div>

              {/* abre e fecha deslizando */}
              <div className={`grid transition-all duration-300 ease-out ${aberto ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {p.materias.map((m) => (
                      <li key={m.nome} className="text-sm">
                        <p className="font-semibold text-slate-800">{m.nome}</p>
                        <p className="text-slate-500">{m.conteudos.join(' · ')}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-slate-500">Disciplinas com o mesmo nome de uma que você já tem são puladas.</p>
      {erro && (
        <p role="alert" className="mt-2 text-sm text-[#A85A00]">
          {erro}
        </p>
      )}
    </div>
  );
}

// ---------- página ----------
const INDICE = [
  ['conta', 'Conta'],
  ['estudo', 'Como você estuda'],
  ['timers', 'Timers'],
  ['materias', 'Matérias prontas'],
  ['dados', 'Dados e ajuda'],
];

export default function Configuracoes() {
  const { user, visitante, sair } = useAuth();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [prefs, setPrefs] = useState(null);
  const [apagado, setApagado] = useState(false);
  const prefsRef = useRef({}); // sempre o valor mais recente, para dois cliques seguidos não se atropelarem

  const nome = (user?.name ?? user?.username ?? '').trim() || 'Usuário';

  // carrega as respostas: as da API (ou do modo visitante) + as que ficam só no navegador
  useEffect(() => {
    let cancelado = false;
    lerPreferencias().then((api) => {
      if (cancelado) return;
      prefsRef.current = { ...api, ...lerLocalPrefs() };
      setPrefs(prefsRef.current);
    });
    return () => {
      cancelado = true;
    };
  }, []);

  // link com #timers etc.: rola até a seção depois que ela existe
  useEffect(() => {
    if (!hash || !prefs) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [hash, prefs]);

  // recebe só o que mudou (ex.: { tempo: 'Mais de 1 hora' }) e junta com o resto
  const salvar = useCallback(async (mudou, limparOutro) => {
    const anterior = prefsRef.current;
    const proximas = { ...anterior, ...mudou };
    if (limparOutro) delete proximas.areaOutro;
    prefsRef.current = proximas;
    setPrefs(proximas); // a tela já mostra a escolha; se falhar, volta abaixo

    const local = {};
    const paraApi = {};
    perguntas.forEach(({ id, api }) => {
      if (proximas[id] !== undefined) (api ? paraApi : local)[id] = proximas[id];
    });
    if (proximas.areaOutro) paraApi.areaOutro = proximas.areaOutro;

    try {
      await salvarPreferencias(paraApi);
    } catch (err) {
      prefsRef.current = anterior;
      setPrefs(anterior);
      throw err;
    }
    try {
      localStorage.setItem(CHAVE_LOCAL, JSON.stringify(local));
    } catch {
      /* sem localStorage: segue sem salvar as respostas locais */
    }
  }, []);

  function apagarDados() {
    apagarDadosLocais();
    setApagado(true);
    setTimeout(() => window.location.reload(), 600);
  }

  function handleSair() {
    sair();
    navigate('/login', { replace: true });
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-8 md:px-12">
      <header className="animate-fade-up">
        <h1 className="text-4xl font-bold text-[#00264D]">Perfil e configurações</h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          Suas respostas ajudam a sugerir timers e matérias. Tudo aqui é opcional e pode ser mudado quando quiser.
        </p>
        <nav aria-label="Seções desta página" className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {INDICE.map(([id, rotulo]) => (
            <a key={id} href={`#${id}`} className="text-[#004A8F] hover:underline">
              {rotulo}
            </a>
          ))}
        </nav>
      </header>

      <div className="mt-8">
        <Secao id="conta" numero="01" titulo="Conta" texto="Quem está usando o app agora." atraso={60}>
          <p className="text-lg font-bold text-slate-800">{nome}</p>
          <p className="text-sm text-slate-500">{user?.email ?? (visitante ? 'Modo visitante' : '—')}</p>
          {visitante && (
            <p className="mt-4 max-w-md text-sm text-slate-600">
              Você está sem conta, então nada disso vai para um servidor. Para guardar de verdade,{' '}
              <Link to="/cadastro" className="font-semibold text-[#004A8F] underline">
                crie uma conta
              </Link>
              .
            </p>
          )}
          <button type="button" onClick={handleSair} className={`${botaoLinha} mt-5`}>
            {visitante ? 'Sair do modo visitante' : 'Sair da conta'}
          </button>
        </Secao>

        {prefs === null ? (
          <p className="border-t border-slate-200 py-10 text-sm text-slate-500">Carregando preferências...</p>
        ) : (
          <>
            <Secao
              id="estudo"
              numero="02"
              titulo="Como você estuda"
              texto="Clique para mudar. Salva na hora. Essas respostas escolhem o que aparece primeiro nas seções abaixo."
              atraso={120}
            >
              <SecaoEstudo prefs={prefs} aoSalvar={salvar} />
            </Secao>

            <Secao
              id="timers"
              numero="03"
              titulo="Timers"
              texto="Deixe prontos os tempos de foco que você mais usa, como o Pomodoro."
              atraso={180}
            >
              <SecaoTimers prefs={prefs} />
            </Secao>

            <Secao
              id="materias"
              numero="04"
              titulo="Matérias prontas"
              texto="Em vez de criar uma por uma, adicione um pacote de disciplinas com os conteúdos já listados."
              atraso={240}
            >
              <SecaoMaterias prefs={prefs} />
            </Secao>
          </>
        )}

        <Secao id="dados" numero="05" titulo="Dados e ajuda" texto="Tour de boas-vindas e dados guardados neste navegador." atraso={300}>
          <button type="button" onClick={() => window.dispatchEvent(new Event(EVENTO_TOUR))} className={botaoLinha}>
            Ver o tour de novo
          </button>

          {visitante && (
            <div className="mt-6 max-w-md">
              <p className="text-sm text-slate-600">
                No modo visitante, disciplinas, tarefas, eventos e timers ficam salvos só aqui. Apagar volta tudo aos
                dados de exemplo.
              </p>
              <button
                type="button"
                onClick={apagarDados}
                disabled={apagado}
                className="mt-3 rounded-xl border border-tj-orange/40 px-4 py-2 text-sm font-semibold text-[#A85A00] hover:bg-tj-orange/10 disabled:opacity-60"
              >
                {apagado ? 'Apagando...' : 'Apagar dados do modo visitante'}
              </button>
            </div>
          )}
        </Secao>
      </div>
    </main>
  );
}
