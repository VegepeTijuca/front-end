import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import BotaoVisitante from './BotaoVisitante';

// Landing page (rota "/"): é a vitrine do site, por isso não aparece na navegação do app.
// Todo o conteúdo abaixo é fixo (não usa API).

const recursos = [
  {
    titulo: 'Calendário',
    texto: 'Marque provas, entregas e revisões e veja tudo por mês, semana ou lista.',
    icone: 'M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z',
  },
  {
    titulo: 'Timer de estudo',
    texto: 'Defina até quando quer focar e acompanhe a contagem regressiva sem distrações.',
    icone: 'M12 6v6l4 2M12 21a9 9 0 100-18 9 9 0 000 18z',
  },
  {
    titulo: 'To-do list',
    texto: 'Liste suas tarefas, favorite as mais importantes e risque o que já terminou.',
    icone: 'M9 11l3 3 8-8M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h9',
  },
  {
    titulo: 'Disciplinas e conteúdos',
    texto: 'Organize cada matéria com seus conteúdos em um só lugar.',
    icone: 'M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z',
  },
];

const passos = [
  { titulo: 'Crie sua conta', texto: 'Leva menos de um minuto e é grátis.' },
  { titulo: 'Conte como você estuda', texto: 'Responda algumas perguntas rápidas sobre seus objetivos.' },
  { titulo: 'Organize sua rotina', texto: 'Cadastre disciplinas, tarefas e eventos e mantenha o foco.' },
];

function Icone({ d }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Inicio() {
  const { autenticado } = useAuth();

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-['Nunito',sans-serif] text-slate-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <p className="text-3xl font-extrabold tracking-tight text-[#004A8F]">clʌss.me</p>

        <nav aria-label="Acesso" className="flex items-center gap-2">
          {autenticado ? (
            <Link
              to="/dashboard"
              className="rounded-xl bg-[#004A8F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003B73]"
            >
              Ir para o painel
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#00264D] hover:bg-white"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="rounded-xl bg-[#004A8F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003B73]"
              >
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </header>

      <main>
        {/* hero */}
        <section className="mx-auto max-w-6xl px-3 sm:px-6">
          <div className="relative overflow-hidden rounded-4xl bg-[linear-gradient(165deg,#004A8F,#00356B_55%,#00264D)] px-6 py-16 text-center text-white sm:px-12 sm:py-24">
            {/* círculos decorativos que flutuam devagar */}
            <div aria-hidden="true" className="pointer-events-none absolute -left-16 top-10 h-56 w-56 animate-float rounded-full bg-white/5" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 bottom-8 h-72 w-72 animate-float rounded-full bg-white/5 [animation-delay:-3s]" />

            <span className="relative inline-block animate-fade-up rounded-full bg-white/20 px-5 py-2 text-sm font-medium backdrop-blur">
              Seus estudos, organizados
            </span>
            <h1 style={{ animationDelay: '80ms' }} className="relative mx-auto mt-6 max-w-3xl animate-fade-up text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Organize seus estudos e mantenha o foco
            </h1>
            <p style={{ animationDelay: '160ms' }} className="relative mx-auto mt-5 max-w-2xl animate-fade-up text-lg text-white/85">
              Calendário, timer, tarefas e disciplinas em um só lugar, para você gastar menos tempo
              se organizando e mais tempo aprendendo.
            </p>

            <div style={{ animationDelay: '240ms' }} className="relative mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to={autenticado ? '/dashboard' : '/cadastro'}
                className="rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#004A8F] shadow-md transition hover:bg-slate-100 active:scale-[0.98]"
              >
                {autenticado ? 'Ir para o painel' : 'Começar agora, é grátis'}
              </Link>
              {!autenticado && (
                <Link
                  to="/login"
                  className="rounded-xl border border-white/50 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Já tenho conta
                </Link>
              )}
              {!autenticado && (
                <BotaoVisitante className="rounded-xl px-7 py-3.5 text-sm font-semibold text-white/90 underline-offset-4 hover:underline">
                  Explorar sem conta
                </BotaoVisitante>
              )}
            </div>
          </div>
        </section>

        {/* recursos */}
        <section className="mx-auto max-w-6xl px-6 py-20" aria-labelledby="titulo-recursos">
          <h2 id="titulo-recursos" className="text-center text-3xl font-bold text-[#00264D]">
            Tudo o que você precisa para estudar melhor
          </h2>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recursos.map((r, i) => (
              <li
                key={r.titulo}
                style={{ animationDelay: `${i * 90}ms` }}
                className="animate-fade-up rounded-[28px] bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.10)]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#004A8F]/10 text-[#004A8F]">
                  <Icone d={r.icone} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-[#00264D]">{r.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{r.texto}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* como funciona */}
        <section className="mx-auto max-w-6xl px-6 pb-20" aria-labelledby="titulo-passos">
          <h2 id="titulo-passos" className="text-center text-3xl font-bold text-[#00264D]">
            Como funciona
          </h2>

          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {passos.map((p, i) => (
              <li
                key={p.titulo}
                style={{ animationDelay: `${i * 90}ms` }}
                className="flex animate-fade-up gap-4 rounded-[28px] bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.10)]"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#004A8F] font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-[#00264D]">{p.titulo}</h3>
                  <p className="mt-1 text-sm text-slate-600">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © 2026 clʌss.me. Todos os direitos reservados.
      </footer>
    </div>
  );
}
