// Lista de cores com o que cada uma significa.
export default function Legenda({ itens, compacta = false }) {
  return (
    <ul className={compacta ? 'grid gap-2 sm:grid-cols-2' : 'space-y-2'}>
      {itens.map((c) => (
        <li key={c.rotulo} className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-2">
          <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: c.cor }} aria-hidden="true" />
          <p className="text-sm text-slate-600">
            <strong className="text-slate-800">{c.rotulo}.</strong> {c.texto}
          </p>
        </li>
      ))}
    </ul>
  );
}
