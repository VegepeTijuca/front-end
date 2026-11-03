// Página "Sobre": conteúdo fixo (não usa API). Edite os textos à vontade.
const recursos = [
  ['Calendário', 'Eventos, provas e entregas por mês, semana, dia ou lista.'],
  ['Timer de estudo', 'Contagem regressiva até a hora em que você quer terminar de focar.'],
  ['To-do list', 'Tarefas com favoritos e marcação de concluídas.'],
  ['Disciplinas', 'Cada matéria com os seus conteúdos organizados.'],
];

export default function Sobre() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-8 md:px-12">
      <h1 className="text-4xl font-bold text-[#00264D]">Sobre</h1>

      <section className="rounded-[28px] bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-bold text-[#00264D]">O que é o clʌss.me?</h2>
        <p className="mt-3 leading-relaxed text-slate-600">
          O clʌss.me é um espaço para organizar seus estudos em um só lugar: você cadastra suas
          disciplinas e conteúdos, marca compromissos no calendário, lista tarefas e usa o timer para
          manter o foco.
        </p>
      </section>

      <section className="rounded-[28px] bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-bold text-[#00264D]">O que você encontra aqui</h2>
        <ul className="mt-4 space-y-3">
          {recursos.map(([titulo, texto]) => (
            <li key={titulo} className="flex gap-3">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#004A8F]" aria-hidden="true" />
              <p className="text-slate-600">
                <strong className="text-slate-800">{titulo}.</strong> {texto}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-sm text-slate-500">© 2026 clʌss.me. Todos os direitos reservados.</p>
    </main>
  );
}
