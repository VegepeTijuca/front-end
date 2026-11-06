import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function Highlight({ children }) {
  return (
    <span className="box-decoration-clone rounded-2xl bg-linear-to-b from-[#5870f2] to-[#3349D6] px-3 py-1 text-white shadow-lg shadow-[#3349D6]/30 sm:px-5">
      {children}
    </span>
  );
}

const links = [
  { label: 'Início', href: '#inicio' },
  { label: 'Recursos', href: '#recursos' },
  { label: 'Como funciona', href: '#como-funciona' },
];

function NavBar({ autenticado }) {
  return (
    <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-full bg-white/90 px-4 py-2.5 shadow-sm shadow-[#0A1F4D]/5 backdrop-blur sm:px-6">
      <Link to="/" className="text-2xl font-extrabold tracking-tight text-[#3349D6]">
        cl<span className="font-bold">ʌ</span>ss.me
      </Link>

      <ul className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="transition-colors hover:text-[#010eff]">
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <Link to="/sobre" className="transition-colors hover:text-[#0022ff]">
            Sobre
          </Link>
        </li>
      </ul>

      <div className="flex items-center gap-1 sm:gap-2">
        {autenticado ? (
          <Link
            to="/dashboard"
            className="rounded-full bg-[#3349D6] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2a3dbb]"
          >
            Painel
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-[#3349D6] sm:inline-flex"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="rounded-full bg-[#3349D6] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2a3dbb]"
            >
              Criar conta
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function DashboardPreview() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto max-h-56 max-w-md select-none overflow-hidden rounded-t-[2rem] border border-b-0 border-white/70 bg-white/95 p-5 shadow-2xl shadow-[#0A1F4D]/25 sm:max-h-64"
      draggable="false"
      onDragStart={(event) => event.preventDefault()}
    >
      <div className="flex gap-1 rounded-lg bg-slate-50 p-1 text-[11px] font-semibold">
        <span className="flex-1 rounded-md bg-white py-1.5 text-center text-[#0A1F4D] shadow-sm">Foco</span>
        <span className="flex-1 py-1.5 text-center text-slate-400">Pausa curta</span>
        <span className="flex-1 py-1.5 text-center text-slate-400">Pausa longa</span>
      </div>
      <p className="my-5 text-center text-5xl font-medium tabular-nums text-[#0A1F4D] sm:text-6xl">25:00</p>
      <div className="mb-4 rounded-lg bg-[#0A1F4D] py-2 text-center text-xs font-semibold text-white">Iniciar</div>
      <div className="space-y-2 text-xs font-semibold">
        <div className="flex items-center gap-2 rounded-lg bg-[#3349D6] px-3 py-2 text-white">
          <span className="grid h-4 w-4 place-items-center rounded border border-white/70 text-[10px]">✓</span>
          estudar química
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-slate-700">
          <span className="h-4 w-4 rounded border border-slate-300" />
          revisar biologia
        </div>
      </div>
    </div>
  );
}

function FloatingBadge({ children, className = '' }) {
  return (
    <span className={`absolute hidden items-center gap-2 rounded-full bg-[#10175f] px-5 py-2.5 text-sm font-semibold text-white shadow-xl shadow-[#0A1F4D]/25 xl:inline-flex ${className}`}>
      <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
      {children}
    </span>
  );
}

function Hero({ autenticado }) {
  return (
    <section id="inicio" className="w-full">
      <div className="relative overflow-hidden bg-[linear-gradient(to_bottom,transparent_72%,#fff_100%),radial-gradient(ellipse_at_50%_115%,#3349D6_0%,rgba(51,73,214,0.4)_24%,transparent_54%),radial-gradient(circle_at_90%_70%,rgba(56,189,248,0.32),transparent_34%),radial-gradient(circle_at_8%_72%,rgba(51,73,214,0.22),transparent_36%),linear-gradient(#EEF1FF,#FFFFFF_55%)] px-4 pt-5 sm:px-8">
        <NavBar autenticado={autenticado} />

        <div className="relative mx-auto mt-14 max-w-4xl text-center sm:mt-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#3349D6] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#3349D6]" aria-hidden="true" />
            Planejador de estudos inteligente
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-[1.15] tracking-tight text-[#0A1F4D] sm:text-6xl lg:text-7xl">
            Estude com clareza. Alcance seus objetivos <Highlight>sem sobrecarga</Highlight>
          </h1>

          <FloatingBadge className="-left-24 top-44">Cronograma adaptável</FloatingBadge>
          <FloatingBadge className="-right-24 top-72">Timer de foco</FloatingBadge>

          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            O Cl<span className="font-bold">ʌ</span>ss.me é o planejador de estudos inteligente que organiza sua rotina,
            acompanha seu progresso e transforma o seu tempo em aprovação.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={autenticado ? '/dashboard' : '/cadastro'}
              className="w-full rounded-full bg-[#3349D6] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#3349D6]/30 transition hover:bg-[#2a3dbb] hover:shadow-xl sm:w-auto"
            >
              {autenticado ? 'Ir para o painel' : 'Começar Agora Gratuitamente'}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-4xl">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}

const cards = [
  {
    titulo: 'Planejamento Inteligente',
    texto: 'Crie cronogramas personalizados que se adaptam à sua rotina real, sem metas inalcançáveis.',
  },
  {
    titulo: 'Foco & Métricas',
    texto: 'Acompanhe suas horas de estudo, matérias concluídas e métricas de rendimento em gráficos visuais e simples.',
  },
  {
    titulo: 'Fim do Acúmulo de Matérias',
    texto: 'Organize revisões, prazos de provas e entregas de trabalhos para nunca mais ser pego de surpresa.',
  },
];

function Features() {
  return (
    <section id="recursos" className="scroll-mt-6 px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold leading-[1.4] tracking-tight text-[#0A1F4D] sm:text-5xl sm:leading-[1.35]">
          Tudo o que você precisa para <Highlight>dominar sua rotina de estudos</Highlight>
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.titulo}
              className="group rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(51,73,214,0.15)]"
            >
              <h3 className="text-xl font-bold text-[#0A1F4D]">{card.titulo}</h3>
              <p className="mt-3 leading-relaxed text-slate-600">{card.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const passos = [
  { numero: '01', titulo: 'Crie sua conta', texto: 'Cadastre-se em menos de um minuto. É grátis.' },
  { numero: '02', titulo: 'Monte sua rotina', texto: 'Cadastre suas matérias, defina seus horários e deixe o cronograma se ajustar a você.' },
  { numero: '03', titulo: 'Estude e acompanhe', texto: 'Use o timer de foco, marque tarefas como concluídas e veja seu progresso evoluir.' },
];

function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-6 bg-[#F4F6FA] px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-[#3349D6]">Como funciona</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-bold tracking-tight text-[#0A1F4D] sm:text-5xl">
          Comece em três passos
        </h2>
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {passos.map((passo) => (
            <li key={passo.numero} className="group rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(51,73,214,0.15)]">
              <span className="text-5xl font-extrabold text-[#3349D6]/20">{passo.numero}</span>
              <h3 className="mt-4 text-xl font-bold text-[#0A1F4D]">{passo.titulo}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="px-3 py-16 sm:px-5 sm:py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#0A1F4D] p-8 text-white sm:p-14">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#3349D6]/50 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Feito por quem entende a vida de estudante
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            Sabemos o quanto é desafiador equilibrar rotina, foco e saúde mental. O
            Class.me não nasceu apenas para ser mais uma agenda, mas sim um parceiro
            para te dar autonomia e constância.
          </p>
          <Link
            to="/sobre"
            className="mt-9 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0A1F4D] transition hover:bg-sky-50"
          >
            Conheça Nossa História
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer({ autenticado }) {
  return (
    <footer className="p-3 sm:p-5">
      <div className="rounded-[2rem] bg-[radial-gradient(ellipse_at_50%_130%,rgba(51,73,214,0.55),transparent_65%),radial-gradient(circle_at_90%_80%,rgba(56,189,248,0.35),transparent_40%),linear-gradient(#EEF1FF,#FFFFFF)] px-6 py-16 text-center sm:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-[1.4] tracking-tight text-[#0A1F4D] sm:text-5xl sm:leading-[1.35]">
          Pronto para estudar com <Highlight>clareza</Highlight>?
        </h2>
        <p className="mx-auto mt-5 max-w-md text-slate-600">
          Crie sua conta gratuita e monte sua primeira rotina hoje.
        </p>
        <Link
          to={autenticado ? '/dashboard' : '/cadastro'}
          className="mt-8 inline-flex rounded-full bg-[#3349D6] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#3349D6]/30 transition hover:bg-[#2a3dbb]"
        >
          {autenticado ? 'Acessar meu painel' : 'Começar Agora Gratuitamente'}
        </Link>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row">
        <p>
          <span className="font-extrabold text-[#3349D6]">class.me</span> · © 2026 Todos os
          direitos reservados.
        </p>
        <nav aria-label="Rodapé" className="flex gap-6 font-medium">
          <Link to="/sobre" className="hover:text-[#3349D6]">Sobre</Link>
          {autenticado ? (
            <Link to="/dashboard" className="hover:text-[#3349D6]">Painel</Link>
          ) : (
            <>
              <Link to="/login" className="hover:text-[#3349D6]">Entrar</Link>
              <Link to="/cadastro" className="hover:text-[#3349D6]">Criar conta</Link>
            </>
          )}
        </nav>
      </div>
    </footer>
  );
}

export default function Home() {
  const { autenticado } = useAuth();

  return (
    <div className="min-h-screen scroll-smooth bg-white font-['Nunito',sans-serif] text-slate-900">
      <Hero autenticado={autenticado} />
      <Features />
      <HowItWorks />
      <About />
      <Footer autenticado={autenticado} />
    </div>
  );
}
