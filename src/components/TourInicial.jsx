import { useState } from 'react';
import Modal from './Modal';
import Icone from './Icone';
import Legenda from './Legenda';
import { LEGENDA_CORES, TOUR } from '../data/ajuda';

// Tour de boas-vindas em passos. Abre sozinho na primeira visita (ver AppLayout)
// e pode ser aberto de novo pelo menu do perfil.
export default function TourInicial({ onFechar }) {
  const [passo, setPasso] = useState(0);
  const atual = TOUR[passo];
  const ultimo = passo === TOUR.length - 1;

  return (
    <Modal
      titulo={`Passo ${passo + 1} de ${TOUR.length}`}
      onFechar={onFechar}
      largura="max-w-lg"
      rodape={
        <>
          {!ultimo && (
            <button type="button" onClick={onFechar} className="mr-auto text-sm font-semibold text-slate-500 hover:text-slate-700">
              Pular
            </button>
          )}
          {passo > 0 && (
            <button
              type="button"
              onClick={() => setPasso(passo - 1)}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Voltar
            </button>
          )}
          <button
            type="button"
            onClick={() => (ultimo ? onFechar() : setPasso(passo + 1))}
            className="rounded-xl bg-[#004A8F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003B73] active:scale-[0.98]"
          >
            {ultimo ? 'Começar' : 'Próximo'}
          </button>
        </>
      }
    >
      <div key={passo} className="animate-fade-in">
        <span style={{ color: atual.cor }}>
          <Icone d={atual.icone} className="h-8 w-8" />
        </span>
        <h3 className="mt-4 text-2xl font-bold text-[#00264D]">{atual.titulo}</h3>
        <p className="mt-1 text-slate-600">{atual.texto}</p>

        {atual.pontos && (
          <ul className="mt-4 space-y-2">
            {atual.pontos.map((p) => (
              <li key={p.texto} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                <span className="text-[#004A8F]">
                  <Icone d={p.icone} className="h-5 w-5" />
                </span>
                {p.texto}
              </li>
            ))}
          </ul>
        )}

        {atual.cores && (
          <div className="mt-4">
            <Legenda itens={LEGENDA_CORES} />
          </div>
        )}
      </div>

      <div className="mt-5 flex justify-center gap-1.5" aria-hidden="true">
        {TOUR.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === passo ? 'w-6 bg-[#004A8F]' : 'w-1.5 bg-slate-300'}`} />
        ))}
      </div>
    </Modal>
  );
}
