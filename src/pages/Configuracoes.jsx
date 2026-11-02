import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { apagarDadosLocais } from '../services/visitante';

// Lê o que foi salvo no navegador pelo setup (localStorage). Não usa API.
function lerJson(chave) {
  try {
    return JSON.parse(localStorage.getItem(chave)) ?? {};
  } catch {
    return {};
  }
}

const ROTULOS = {
  area: 'Área de estudo',
  objetivo: 'Objetivo',
  estilo: 'Jeito de aprender',
  tempo: 'Tempo por dia',
  periodo: 'Melhor período',
};

const cartao = 'rounded-[28px] bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)] sm:p-8';

export default function Configuracoes() {
  const { user, visitante, sair } = useAuth();
  const navigate = useNavigate();
  const [apagado, setApagado] = useState(false);

  const nome = (user?.name ?? user?.username ?? '').trim() || 'Usuário';

  // respostas guardadas só neste navegador: as perguntas "locais" do setup + as do modo visitante
  const preferencias = {
    ...lerJson('classme:local:preferencias'),
    ...lerJson('classme:preferencias-locais'),
  };
  const respostas = Object.entries(ROTULOS)
    .filter(([id]) => preferencias[id])
    .map(([id, rotulo]) => [
      rotulo,
      id === 'area' && preferencias.areaOutro ? preferencias.areaOutro : preferencias[id],
    ]);

  function apagarDados() {
    apagarDadosLocais();
    setApagado(true);
    // recarrega para as telas voltarem aos dados de exemplo
    setTimeout(() => window.location.reload(), 600);
  }

  function handleSair() {
    sair();
    navigate('/login', { replace: true });
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-8 md:px-12">
      <h1 className="text-4xl font-bold text-[#0A1F4D]">Configurações</h1>

      <section className={cartao} aria-labelledby="cfg-conta">
        <h2 id="cfg-conta" className="text-xl font-bold text-[#0A1F4D]">Conta</h2>
        <div className="mt-4 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-pink-300 text-xl font-bold text-white">
            {nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-800">{nome}</p>
            <p className="text-sm text-slate-500">{user?.email ?? (visitante ? 'Modo visitante' : '—')}</p>
          </div>
        </div>

        {visitante && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Você está sem conta. Para guardar seus dados de verdade,{' '}
            <Link to="/cadastro" className="font-semibold underline">crie uma conta</Link>.
          </p>
        )}
      </section>

      <section className={cartao} aria-labelledby="cfg-pref">
        <h2 id="cfg-pref" className="text-xl font-bold text-[#0A1F4D]">Preferências de estudo</h2>

        {respostas.length > 0 ? (
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {respostas.map(([rotulo, valor]) => (
              <div key={rotulo} className="rounded-xl bg-slate-50 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{rotulo}</dt>
                <dd className="mt-0.5 font-semibold text-slate-800">{valor}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Você ainda não respondeu as perguntas de preferências.</p>
        )}

        <Link
          to="/setup-usuario"
          className="mt-5 inline-block rounded-xl bg-[#3349D6] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2a3dbb]"
        >
          {respostas.length > 0 ? 'Refazer perguntas' : 'Responder agora'}
        </Link>
      </section>

      {visitante && (
        <section className={cartao} aria-labelledby="cfg-dados">
          <h2 id="cfg-dados" className="text-xl font-bold text-[#0A1F4D]">Dados deste navegador</h2>
          <p className="mt-2 text-sm text-slate-500">
            No modo visitante, disciplinas, tarefas, eventos e timer ficam salvos só aqui. Apagar volta tudo
            aos dados de exemplo.
          </p>
          <button
            type="button"
            onClick={apagarDados}
            disabled={apagado}
            className="mt-4 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            {apagado ? 'Apagando...' : 'Apagar dados do modo visitante'}
          </button>
        </section>
      )}

      <section className={cartao} aria-labelledby="cfg-sessao">
        <h2 id="cfg-sessao" className="text-xl font-bold text-[#0A1F4D]">Sessão</h2>
        <button
          type="button"
          onClick={handleSair}
          className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          {visitante ? 'Sair do modo visitante' : 'Sair da conta'}
        </button>
      </section>
    </main>
  );
}
