import { useEffect, useId, useRef } from 'react';

/**
 * Modal genérico (usa o <dialog> nativo: prende o foco, fecha com Esc e devolve o foco ao fechar).
 *
 * Props:
 * - titulo:   texto do cabeçalho
 * - onFechar: () => void
 * - rodape:   conteúdo opcional da faixa de botões
 * - largura:  classe de largura máxima (padrão max-w-lg)
 */
export default function Modal({ titulo, onFechar, children, rodape, largura = 'max-w-lg' }) {
  const ref = useRef(null);
  const idTitulo = useId();
  const comecouNoFundo = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      onCancel={(e) => {
        e.preventDefault();
        onFechar();
      }}
      // só fecha se o clique COMEÇOU e TERMINOU no fundo
      onMouseDown={(e) => {
        comecouNoFundo.current = e.target === ref.current;
      }}
      onClick={(e) => {
        if (e.target === ref.current && comecouNoFundo.current) onFechar();
      }}
      className={`m-auto w-[calc(100%-2rem)] ${largura} rounded-3xl bg-transparent p-0 open:animate-pop backdrop:bg-slate-900/40`}
    >
      <div className="max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-xl sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={idTitulo} className="text-xl font-bold text-[#00264D]">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {children}

        {rodape && <div className="mt-6 flex flex-wrap items-center justify-end gap-2">{rodape}</div>}
      </div>
    </dialog>
  );
}
