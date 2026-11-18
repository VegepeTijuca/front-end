import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { adicionarPacote } from '../services/presetService';
import { criarTimer, definirTimerPadrao, listarTimers, removerTimer } from '../services/timerService';
import { PACOTES_MATERIAS, TIMERS_SUGERIDOS } from '../data/presets';

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

const botaoPrimario =
  'rounded-xl bg-[#004A8F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003B73] cursor-pointer active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60';
const botaoLinha =
  'rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-[#004A8F] transition hover:bg-[#004A8F]/5 cursor-pointer active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60';
const campo =
  'h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#004A8F] focus:ring-2 focus:ring-[#004A8F]/20';



// ---------- 03: matérias prontas ----------
function SecaoMaterias() {
  const [feitos, setFeitos] = useState({}); // chave do pacote -> quantas disciplinas criou
  const [ocupado, setOcupado] = useState('');
  const [abertos, setAbertos] = useState({});
  const [erro, setErro] = useState('');

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
        {PACOTES_MATERIAS.map((p) => {
          const feito = feitos[p.chave];
          const aberto = abertos[p.chave];
          return (
            <li key={p.chave} className="py-5">
              <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-800">
                    {p.nome}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-500">{p.descricao}</p>
                  <p className="mt-2 text-sm text-slate-700">{p.materias.map((m) => m.nome).join(', ')}.</p>
                  <button
                    type="button"
                    onClick={() => setAbertos((a) => ({ ...a, [p.chave]: !a[p.chave] }))}
                    aria-expanded={Boolean(aberto)}
                    className="mt-2 cursor-pointer text-sm font-semibold text-[#004A8F] hover:underline"
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
  ['materias', 'Matérias prontas'],
];

export default function Configuracoes() {
  const { user, sair } = useAuth();
  const navigate = useNavigate();
  const { hash } = useLocation();

  const nome = (user?.name ?? user?.username ?? '').trim() || 'Usuário';

  // link com #timers etc.: rola até a seção
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  function handleSair() {
    sair();
    navigate('/login', { replace: true });
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-8 md:px-12">
      <header className="animate-fade-up">
        <h1 className="text-4xl font-bold text-[#00264D]">Perfil e configurações</h1>
        <p className="mt-2 max-w-2xl text-slate-500">Sua conta e pacotes de matérias prontas.</p>
        <nav aria-label="Seções desta página" className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {INDICE.map(([id, rotulo]) => (
            <a key={id} href={`#${id}`} className="cursor-pointer text-[#004A8F] hover:underline">
              {rotulo}
            </a>
          ))}
        </nav>
      </header>

      <div className="mt-8">
        <Secao id="conta" numero="01" titulo="Conta" texto="Quem está usando o app agora." atraso={60}>
          <p class="text-lg font-bold text-slate-800">{nome}</p>
          <p className="text-sm text-slate-500">{user?.email ?? '—'}</p>
          <button type="button" onClick={handleSair} className={`${botaoLinha} mt-5`}>
            Sair da conta
          </button>
        </Secao>

        <Secao id="materias" numero="03" titulo="Matérias prontas" texto="Adicione disciplinas e conteúdos organizados por edital." atraso={180}>
          <SecaoMaterias />
        </Secao>
      </div>
    </main>
  );
}
