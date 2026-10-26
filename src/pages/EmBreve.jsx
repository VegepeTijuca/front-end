import { Link } from 'react-router-dom';

export default function EmBreve({ titulo, tela = false }) {
  return (
    <main
      className={`px-6 py-8 md:px-12 ${
        tela ? 'grid min-h-screen place-items-center bg-[#F4F6FA]' : ''
      }`}
    >
      <div className="rounded-[28px] bg-white p-8 text-center shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        <h1 className="text-3xl font-bold text-[#0A1F4D]">{titulo}</h1>
        <p className="mt-2 text-slate-500">Esta página ainda está em construção.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-[#3349D6] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2a3dbb]"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}