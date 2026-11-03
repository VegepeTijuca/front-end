import { useId, useState } from 'react';
import { criarDisciplinas } from '../services/disciplinaService'

export default function FormDisciplina({ onCriada }) {
  const idBase = useId();
  const [disciplina, setDisciplina] = useState({ name: '', descricao: '' });
  const [enviando, setEnviando] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setStatus(null);

    try {
      await criarDisciplinas(disciplina);
      setDisciplina({ name: '', descricao: '' });
      setStatus({ tipo: 'sucesso', texto: 'Disciplina cadastrada com sucesso!' });
          onCriada?.();
    } catch (err) {
      setStatus({
        tipo: 'erro',
        texto:
          err.response?.data?.error?.message ??
          err.response?.data?.error ??
          'Não foi possível cadastrar a disciplina.',
      });
    } finally {
      setEnviando(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setDisciplina((atual) => ({ ...atual, [name]: value }));
  }

  return (
    <section className="mx-auto w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:p-10">
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#00264D]">Gerenciamento de Disciplinas</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">Cadastre uma disciplina e, se desejar, adicione uma descrição.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor={`${idBase}-name`} className="block text-sm font-semibold text-slate-900">
            Insira a disciplina
          </label>
          <input
            type="text"
            id={`${idBase}-name`}
            name="name"
            placeholder="Nome da disciplina"
            value={disciplina.name}
            onChange={handleChange}
            required
            className="block w-full rounded-2xl border border-transparent bg-slate-50 px-5 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#004A8F] focus:bg-white focus:ring-4 focus:ring-[#004A8F]/15"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={`${idBase}-descricao`} className="block text-sm font-semibold text-slate-900">
            Descrição <span className="font-normal text-slate-400">(opcional)</span>
          </label>
          <input
            type="text"
            id={`${idBase}-descricao`}
            name="descricao"
            placeholder="Descrição da disciplina"
            value={disciplina.descricao}
            onChange={handleChange}
            className="block w-full rounded-2xl border border-transparent bg-slate-50 px-5 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#004A8F] focus:bg-white focus:ring-4 focus:ring-[#004A8F]/15"
          />
        </div>

        {status && (
          <p
            role={status.tipo === 'erro' ? 'alert' : 'status'}
            className={`rounded-2xl px-4 py-3 text-sm font-medium ring-1 ${
              status.tipo === 'erro'
                ? 'bg-tj-orange/10 text-[#A85A00] ring-tj-orange/25'
                : 'bg-emerald-50 text-emerald-700 ring-emerald-100'
            }`}
          >
            {status.texto}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full mx-auto block rounded-2xl bg-[#004A8F] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003B73] focus:outline-none focus:ring-4 focus:ring-[#004A8F]/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#004A8F] disabled:active:scale-100 sm:w-auto"
        >
          {enviando ? 'Cadastrando...' : 'Cadastrar Disciplina'}
        </button>
      </form>
    </section>
  );
}
