import { useState } from 'react';
import Modal from './Modal';
import Icone from './Icone';
import Legenda from './Legenda';
import { AJUDA, ICONES, LEGENDA_CORES } from '../data/ajuda';

// Botão "Como funciona" que abre um modal com a explicação da tela (textos em data/ajuda.js).
export default function BotaoAjuda({ tela, className = '' }) {
  const [aberto, setAberto] = useState(false);
  const ajuda = AJUDA[tela];
  if (!ajuda) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        title="Explica o que cada parte desta tela faz"
        className={`inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-[#004A8F] transition hover:border-[#004A8F]/50 hover:bg-[#004A8F]/5 ${className}`}
      >
        <Icone d={ICONES.ajuda} className="h-4 w-4" />
        Como funciona
      </button>

      {aberto && (
        <Modal
          titulo={ajuda.titulo}
          onFechar={() => setAberto(false)}
          largura="max-w-xl"
          rodape={
            <button
              type="button"
              onClick={() => setAberto(false)}
              className="rounded-xl bg-[#004A8F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003B73] active:scale-[0.98]"
            >
              Entendi
            </button>
          }
        >
          <p className="mb-4 text-sm text-slate-500">{ajuda.intro}</p>

          <ul className="space-y-3">
            {ajuda.itens.map((item) => (
              <li key={item.titulo} className="flex gap-3">
                <span className="mt-0.5 shrink-0" style={{ color: item.cor }}>
                  <Icone d={item.icone} />
                </span>
                <div>
                  <p className="font-semibold text-slate-800">{item.titulo}</p>
                  <p className="text-sm text-slate-600">{item.texto}</p>
                </div>
              </li>
            ))}
          </ul>

          {ajuda.cores && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Cores dos eventos</p>
              <Legenda itens={ajuda.cores} compacta />
            </div>
          )}

          {ajuda.legenda && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">O que significam as cores</p>
              <Legenda itens={LEGENDA_CORES} compacta />
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
