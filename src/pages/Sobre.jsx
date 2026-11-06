import { Link } from 'react-router-dom';

// Links âncora do menu (rolam até a seção com o id correspondente)
// O href de cada item deve corresponder ao id de uma seção abaixo.
const links = [
  { label: 'História', href: '#historia' },
  { label: 'Nome', href: '#nome' },
  { label: 'Valores', href: '#valores' },
  { label: 'Recursos', href: '#recursos' },
];

// Cartão "ANTES": a rotina antes do class.me
// Os objetos descrevem cada linha exibida dentro do cartão.
const itensAntes = [
  { texto: 'agenda', status: 'ruim', detalhe: 'perdida' },
  { texto: 'aplicativo', status: 'ruim', detalhe: 'confuso' },
  { texto: 'provas e trabalhos', status: 'ruim', detalhe: 'sem equilíbrio' },
];

// Cartão "DEPOIS": a rotina com o class.me
// Mantemos a mesma estrutura de itensAntes para reutilizar o componente Cartao.
const itensDepois = [
  { texto: 'calendário', status: 'feita', detalhe: '✓' },
  { texto: 'timer de estudo', status: 'feita', detalhe: '✓' },
  { texto: 'conquistar objetivos', status: 'pendente', detalhe: 'a caminho' },
];

// Cada status tem o seu estilo (Tailwind) de linha
// As chaves precisam combinar com o valor de item.status nos arrays acima.
const estilosItem = {
  ruim: 'bg-red-50 text-red-600',
  feita: 'bg-[#3349D6] text-white',
  pendente: 'border border-slate-200 text-slate-700',
};

// O que não funcionava (aparece riscado na seção de história)
const tentativas = [
  'Agendas perdidas',
  'Aplicativos cheios de botões confusos',
];

// As letras do nome: cada uma é a inicial de uma pessoa do projeto
const letras = ['C', 'L', 'Ʌ', 'S', 'S'];

// Os três valores da marca
// Cada valor tem um número único, usado também como key na lista de cartões.
const valores = [
  {
    numero: '01',
    titulo: 'Estudar melhor, não mais pesado',
    texto: 'Acreditamos na constância e no equilíbrio, e não em passar horas exaustivas sem descanso.',
  },
  {
    numero: '02',
    titulo: 'Praticidade no dia a dia',
    texto: 'Menos tempo configurando a rotina e mais tempo focando no que realmente importa.',
  },
  {
    numero: '03',
    titulo: 'Autonomia',
    texto: 'Ferramentas flexíveis para você assumir o controle do seu tempo.',
  },
];

// O que o app oferece (um cartão para cada recurso)
// Adicione ou remova recursos editando os objetos desta lista.
const recursos = [
  {
    titulo: 'Calendário',
    texto: 'Visualize eventos, provas e entregas por mês, semana, dia ou lista.',
  },
  {
    titulo: 'Timer de estudo',
    texto: 'Mantenha o foco absoluto com contagem regressiva até a hora em que você quer terminar.',
  },
  {
    titulo: 'To-do list',
    texto: 'Gerencie suas tarefas, defina favoritos e marque o que já foi concluído.',
  },
  {
    titulo: 'Disciplinas',
    texto: 'Mantenha cada matéria e seus respectivos conteúdos perfeitamente organizados.',
  },
];

/**
 * Componente: Highlight
 * Funcionalidade: pílula azul em degradê usada para destacar uma palavra-chave dentro dos títulos.
 * O { children } é o texto que fica entre <Highlight> e </Highlight>.
 */
function Highlight({ children }) {
  return (
    // box-decoration-clone = se o texto quebrar de linha, cada pedaço mantém o fundo e os cantos
    // bg-linear-to-b from-... to-... = degradê vertical (azul claro -> azul principal)
    // shadow-lg shadow-[#3349D6]/30 = sombra azulada suave
    <span className="box-decoration-clone rounded-2xl bg-linear-to-b from-[#5870f2] to-[#3349D6] px-3 py-1 text-white shadow-lg shadow-[#3349D6]/30 sm:px-5">
      {children}
    </span>
  );
}

/**
 * Componente: NavBar
 * Funcionalidade: barra de navegação em formato de pílula branca. Tem a logo, o link
 * "Início", os links de âncora da própria página e os botões "Entrar" e "Criar conta".
 */
function NavBar() {
  return (
    // mx-auto + max-w-3xl = centralizada e compacta | rounded-full = pílula
    // bg-white/90 + backdrop-blur = branco levemente translúcido com efeito de vidro
    <nav className="mx-auto flex max-w-3xl items-center justify-between rounded-full border border-white bg-white/90 px-3 py-2 shadow-lg shadow-[#3349D6]/10 backdrop-blur sm:px-4">
      <Link to="/" className="pl-2 text-xl font-extrabold tracking-tight text-[#3349D6]">
        cl<span className="font-bold">ʌ</span>ss.me<span></span>
      </Link>

      {/* hidden md:flex = escondida no celular, aparece a partir de 768px */}
      <ul className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
        <li>
          {/* Link = troca de página sem recarregar (vai para a home) */}
          <Link to="/" className="transition-colors hover:text-[#3349D6]">
            Início
          </Link>
        </li>
        {links.map((link) => (
          <li key={link.href}>
            {/* <a href="#id"> = rola até a seção da mesma página */}
            <a href={link.href} className="transition-colors hover:text-[#3349D6]">
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Links de navegação do produto: login e criação de conta. */}
        <Link
          to="/login"
          className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-[#3349D6] sm:inline-flex"
        >
          Entrar
        </Link>
        <Link
          to="/cadastro"
          className="rounded-full bg-linear-to-b from-[#5b78f5] to-[#3349D6] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-[#3349D6]/40 ring-1 ring-[#3349D6]/30 transition hover:brightness-110"
        >
          Criar conta
        </Link>
      </div>
    </nav>
  );
}

/**
 * Componente: Chip
 * Funcionalidade: etiqueta flutuante que fica "pendurada" no canto dos cartões.
 * Props: rotulo (texto pequeno), valor (texto em destaque), tipo ('bom' = verde / 'ruim' = vermelho)
 * e className (a posição, definida por quem usa o componente).
 */
function Chip({ rotulo, valor, tipo, className = '' }) {
  // Converte o tipo recebido em uma condição simples para escolher cores e ícone.
  const ruim = tipo === 'ruim';
  return (
    // absolute = posicionado livremente em cima do cartão | bg-red-50 / bg-emerald-50 = fundo claro vermelho ou verde
    <div>
      <span className={`absolute rounded-xl px-3 py-2 shadow-lg ${ruim ? 'bg-red-50' : 'bg-emerald-50'} ${className}`}>
        <span className="block text-[11px] font-semibold text-slate-400">{rotulo}</span>
        <span className={`block text-lg font-extrabold ${ruim ? 'text-red-500' : 'text-emerald-500'}`}>
          {ruim ? '✕' : '✓'} {valor}
        </span>
      </span>
    </div>
  );
}

/**
 * Componente: Cartao
 * Funcionalidade: mini cartão ilustrativo com título, subtítulo e uma lista de itens.
 * É usado duas vezes (Antes e Depois), mudando só os dados que recebe por props.
 */
function Cartao({ titulo, subtitulo, itens }) {
  return (
    // border-[6px] border-[#cfdcff] = moldura grossa azul-clara | w-64 / sm:w-72 = largura fixa
    <div className="w-64 rounded-[1.75rem] border-[6px] border-[#cfdcff] bg-white p-4 shadow-xl shadow-[#3349D6]/15 sm:w-72">
      <div>
        <p className="text-sm font-bold text-[#0A1F4D]">{titulo}</p>
        <p className="text-xs text-slate-400">{subtitulo}</p>
      </div>

      {/* space-y-2 = 0.5rem de espaço entre as linhas */}
      <ul className="mt-4 space-y-2 text-xs font-semibold">
        {/* Cada linha recebe texto, detalhe e estilo conforme o seu status. */}
        {itens.map((item) => (
          <li
            key={item.texto}
            className={`flex items-center justify-between rounded-lg px-3 py-2 ${estilosItem[item.status]}`}
          >
            {/* line-through = riscado, só quando o item é "ruim" */}
            <span className={item.status === 'ruim' ? 'line-through' : ''}>{item.texto}</span>
            <span>{item.detalhe}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Componente: AntesDepois
 * Funcionalidade: ilustração do Hero: o cartão "Antes" (a rotina exaustiva, apagada e inclinada),
 * uma seta curva e o cartão "Depois" (a rotina com o class.me), com chips nos cantos.
 */
function AntesDepois() {
  return (
    // aria-hidden = decorativo (leitores de tela ignoram)
    // max-h-80 + overflow-hidden = corta os cartões embaixo | [mask-image:...] = a parte de baixo vai sumindo (fade)
    <div
      aria-hidden="true"
      className="relative mx-auto mt-16 flex max-h-80 max-w-3xl items-end justify-center overflow-hidden px-10 pt-12 [mask-image:linear-gradient(to_bottom,black_55%,transparent)] md:gap-28"
    >
      {/* O contêiner é decorativo; aria-hidden evita que leitores de tela leiam a ilustração. */}
      {/* ANTES: só aparece a partir de 768px (hidden md:block) */}
      <div className="relative hidden -rotate-3 opacity-75 md:block">
        <span className="absolute -top-10 left-4 -rotate-6 text-2xl font-semibold italic text-slate-400">
          Antes
        </span>
        <Cartao titulo="Minha rotina exaustiva" subtitulo="Provas, trabalhos e sanidade" itens={itensAntes} />
        <Chip rotulo="Agenda" valor="perdida" tipo="ruim" className="-left-8 top-8" />
        <Chip rotulo="Botões" valor="confusos" tipo="ruim" className="-right-8 top-40" />
      </div>

      {/* DEPOIS: sempre aparece (é o único visível no celular) */}
      <div className="relative">
        <span className="absolute -top-10 right-4 rotate-6 text-2xl font-semibold italic text-slate-400">
          Depois
        </span>
        <Cartao titulo="Minha rotina" subtitulo="Leve e direta ao ponto" itens={itensDepois} />
        <Chip rotulo="Rotina" valor="leve" tipo="bom" className="-left-8 top-8" />
        <Chip rotulo="Foco" valor="absoluto" tipo="bom" className="-right-8 top-24 rotate-6" />
      </div>
    </div>
  );
}

/**
 * Componente: Hero
 * Funcionalidade: topo da página. Banner azul em degradê, navbar, título,
 * a frase de abertura do class.me, o botão para a história e o visual Antes e Depois.
 */
function Hero() {
  return (
    <section className="p-3 sm:p-5">
      {/* bg-[...] = 4 fundos empilhados: brilho azul no topo, brilho nas laterais e uma base que vai de azul claro a branco */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(91,141,255,0.55),transparent_65%),radial-gradient(circle_at_0%_35%,rgba(51,73,214,0.25),transparent_45%),radial-gradient(circle_at_100%_35%,rgba(56,189,248,0.28),transparent_45%),linear-gradient(#cfdcff_0%,#e9f0ff_38%,#ffffff_80%)] px-4 pt-5 sm:px-8">
        <NavBar />

        <div className="mx-auto mt-14 max-w-3xl text-center sm:mt-20">
          {/* Chamada principal: o destaque é aplicado só ao trecho final do título. */}
          <h1 className="text-4xl font-bold leading-[1.2] tracking-tight text-[#0A1F4D] sm:text-6xl lg:text-7xl">
            O planejador de estudos pensado <Highlight>por quem vive a rotina estudantil.</Highlight>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            O Cl<span className="font-extralight">ʌ</span>ss.me.<span></span> nasceu para resolver o maior desafio de quem estuda: tirar o peso da
            desorganização e transformar o caos de prazos, matérias e tarefas em um caminho claro
            e descomplicado.
          </p>

          {/* shadow-[inset_...,0_12px_30px_...] = reflexo branco no topo + brilho azul embaixo (botão "brilhante") */}
          <a
            href="#historia"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-linear-to-b from-[#5b78f5] to-[#3349D6] px-8 py-4 text-base font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_30px_rgba(51,73,214,0.45)] ring-1 ring-[#3349D6]/40 transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Conheça nossa história
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <AntesDepois />
      </div>
    </section>
  );
}

/**
 * Componente: Historia
 * Funcionalidade: conta de onde veio o class.me: a rotina exaustiva que a equipe viveu,
 * o que não funcionava (riscado) e a decisão de criar a ferramenta que sempre quiseram ter.
 */
function Historia() {
  return (
    // id="historia" = destino do menu e do botão do Hero | scroll-mt-6 = para um pouco antes do topo ao rolar
    <section id="historia" className="scroll-mt-6 px-4 py-20 sm:px-8 sm:py-28">
      {/* mx-auto + max-w-3xl = coluna de texto centralizada e confortável de ler */}
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold leading-[1.4] tracking-tight text-[#0A1F4D] sm:text-5xl sm:leading-[1.35]">
          Uma rotina exaustiva que decidimos <Highlight>mudar.</Highlight>
        </h2>

        <p className="mt-8 text-lg leading-relaxed text-slate-600">
          Nós passamos exatamente pela rotina exaustiva de tentar equilibrar provas, trabalhos e a
          tentativa de manter a sanidade com:
        </p>

        <ul className="mt-4 space-y-3">
          {/* Reaproveita a lista de problemas declarada no começo do arquivo. */}
          {tentativas.map((tentativa) => (
            <li key={tentativa} className="rounded-xl bg-slate-50 px-5 py-3 text-slate-500 line-through">
              {tentativa}
            </li>
          ))}
        </ul>

        {/* card de destaque com a "virada" da história */}
        <div className="mt-8 rounded-3xl bg-linear-to-br from-[#3349D6] to-[#0A1F4D] p-7 text-xl font-bold leading-snug text-white shadow-lg shadow-[#3349D6]/25 sm:p-9 sm:text-2xl">
          Foi por isso que decidimos criar a ferramenta que sempre quisemos ter — um planejador
          inteligente, leve e direto ao ponto.
        </div>
      </div>
    </section>
  );
}

/**
 * Componente: Nome
 * As letras C-L-A-S-S aparecem em blocos azuis
 * (um para cada pessoa do projeto) e sobem um pouco quando o mouse passa em cima.
 */
function Nome() {
  return (
    <section id="nome" className="scroll-mt-6 bg-[#F4F6FA] px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-[#3349D6]">
          Por trás do nome...
        </p>

        {/* items-end = alinha embaixo (por causa do ".me") | flex-wrap = quebra de linha se faltar espaço */}
        <div className="mt-10 flex flex-wrap items-end justify-center gap-2 sm:gap-3">
          {/* Monta a marca letra por letra; o índice diferencia letras repetidas. */}
          {letras.map((letra, i) => (
            <span
              key={i}
              className="grid h-16 w-14 place-items-center rounded-2xl bg-linear-to-b from-[#5870f2] to-[#3349D6] text-4xl font-extrabold text-white shadow-lg shadow-[#3349D6]/30 transition hover:-translate-y-2 sm:h-24 sm:w-20 sm:text-6xl"
            >
              <span className={letra === 'Ʌ' ? 'font-bold' : ''}>{letra}</span>
            </span>
          ))}
          <span className="text-4xl font-extrabold text-[#0A1F4D] sm:text-6xl">.me</span>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-slate-600">
          O nome class.me carrega a nossa essência: além de remeter a aulas e organização, cada
          letra representa a inicial de cada um de nós que deu vida a este projeto. É a nossa
          história transformada em tecnologia para ajudar você a conquistar seus objetivos.
        </p>
      </div>
    </section>
  );
}

/**
 * Componente: Valores
 * Funcionalidade: mostra os 3 valores da marca em cartões numerados.
 */
function Valores() {
  return (
    <section id="valores" className="scroll-mt-6 px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-[#3349D6]">
          Nossos valores
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-bold tracking-tight text-[#0A1F4D] sm:text-5xl">
          No que acreditamos
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {/* Cada valor vira um cartão; numero é a chave estável de identificação. */}
          {valores.map((valor) => (
            <article
              key={valor.numero}
              className="rounded-3xl border border-slate-100 bg-[#F4F6FA] p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-lg"
            >
              {/* text-[#3349D6]/20 = azul com 20% de opacidade (número "apagado") */}
              <span className="text-5xl font-extrabold text-[#3349D6]/20">{valor.numero}</span>
              <h3 className="mt-4 text-xl font-bold text-[#0A1F4D]">{valor.titulo}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{valor.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Componente: Recursos
 * Funcionalidade: lista tudo o que o app oferece (Calendário, Timer, To-do list e Disciplinas)
 * em 4 cartões. Fica em 1 coluna no celular, 2 em telas médias e 4 no notebook.
 */
function Recursos() {
  return (
    <section id="recursos" className="scroll-mt-6 bg-[#F4F6FA] px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-[#3349D6]">
          Recursos
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl text-center text-3xl font-bold tracking-tight text-[#0A1F4D] sm:text-5xl">
          Tudo o que você encontra no CLASS.ME
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-slate-600">
          Criamos um espaço completo para organizar sua jornada acadêmica em um só lugar:
        </p>

        {/* sm:grid-cols-2 = 2 colunas a partir de 640px | lg:grid-cols-4 = 4 colunas a partir de 1024px */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Os cartões são gerados a partir da lista recursos, sem repetir o mesmo JSX. */}
          {recursos.map((recurso) => (
            <article
              key={recurso.titulo}
              className="rounded-3xl border-t-4 border-[#3349D6] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-lg"
            >
              <h3 className="text-xl font-bold text-[#0A1F4D]">{recurso.titulo}</h3>
              <p className="mt-3 leading-relaxed text-slate-600">{recurso.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Componente: Footer
 * Funcionalidade: chamada final para criar conta, direitos autorais e links rápidos.
 */
function Footer() {
  return (
    <footer className="p-3 sm:p-5">
      {/* Encerramento da página: convite para cadastro e, abaixo, links auxiliares. */}
      <div className="rounded-[2rem] bg-[radial-gradient(ellipse_at_50%_130%,rgba(51,73,214,0.55),transparent_65%),radial-gradient(circle_at_90%_80%,rgba(56,189,248,0.35),transparent_40%),linear-gradient(#EEF1FF,#FFFFFF)] px-6 py-16 text-center sm:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-[1.4] tracking-tight text-[#0A1F4D] sm:text-5xl sm:leading-[1.35]">
          Vamos estudar <Highlight>juntos</Highlight>?
        </h2>
        <Link
          to="/cadastro"
          className="mt-8 inline-flex rounded-full bg-[#3349D6] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#3349D6]/30 transition hover:bg-[#2a3dbb]"
        >
          Começar Agora Gratuitamente
        </Link>
      </div>

      {/* A disposição muda de coluna para linha em telas maiores. */}
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row">
        <p>
          <span className="font-extrabold text-[#3349D6]">class.me</span> · © 2026 Todos os
          direitos reservados.
        </p>
        <nav aria-label="Rodapé" className="flex gap-6 font-medium">
          <Link to="/" className="hover:text-[#3349D6]">Início</Link>
          <Link to="/login" className="hover:text-[#3349D6]">Entrar</Link>
          <Link to="/cadastro" className="hover:text-[#3349D6]">Criar conta</Link>
        </nav>
      </div>
    </footer>
  );
}

/**
 * Componente Principal: Sobre (página "Sobre nós")
 * Funcionalidade: só monta a página, empilhando as seções na ordem em que aparecem.
 * Define também o fundo, a fonte (Nunito) e a cor padrão do texto.
 */
export default function Sobre() {
  return (
    // min-h-screen = a página ocupa pelo menos a altura da tela
    <div className="min-h-screen scroll-smooth bg-white font-['Nunito',sans-serif] text-slate-900">
      {/* A sequência aqui corresponde à ordem das seções apresentadas ao visitante. */}
      <Hero />
      <Historia />
      <Nome />
      <Valores />
      <Recursos />
      <Footer />
    </div>
  );
}