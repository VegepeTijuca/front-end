import BotaoAjuda from './BotaoAjuda';

// Título da página + frase explicando para que serve + botão "Como funciona".
export default function CabecalhoPagina({ titulo, descricao, ajuda }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-4xl font-bold text-[#00264D]">{titulo}</h1>
        {descricao && <p className="mt-1 text-slate-500">{descricao}</p>}
      </div>
      {ajuda && <BotaoAjuda tela={ajuda} className="mt-2" />}
    </div>
  );
}
