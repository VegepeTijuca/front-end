import { useId, useState } from 'react';
import { criar } from '../services/disciplinaService';

export default function FormDisciplina() {
  const idBase = useId();
  const [disciplina, setDisciplina] = useState({ name: '', descricao: '' });
  const [enviando, setEnviando] = useState(false);
  const [status, setStatus] = useState(null); // null | { tipo: 'sucesso' | 'erro', texto }

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setStatus(null);

    try {
      await criar(disciplina);
      setDisciplina({ name: '', descricao: '' });
      setStatus({ tipo: 'sucesso', texto: 'Disciplina cadastrada com sucesso!' });
    } catch (err) {
      setStatus({
        tipo: 'erro',
        texto: err.response?.data?.message ?? 'Não foi possível cadastrar a disciplina.',
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
    <section className="mx-auto w-full max-w-xl rounded-xl bg-white p-6 shadow-md sm:p-8">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Disciplinas</h2>
        <p className="mt-1 text-sm text-gray-600">Cadastre uma disciplina e, se desejar, adicione uma descrição.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor={`${idBase}-name`} className="block text-sm font-medium text-gray-700">
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
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={`${idBase}-descricao`} className="block text-sm font-medium text-gray-700">
            Descrição <span className="font-normal text-gray-500">(opcional)</span>
          </label>
          <input
            type="text"
            id={`${idBase}-descricao`}
            name="descricao"
            placeholder="Descrição da disciplina"
            value={disciplina.descricao}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {status && (
          <p
            role={status.tipo === 'erro' ? 'alert' : 'status'}
            className={`text-sm ${status.tipo === 'erro' ? 'text-red-600' : 'text-green-700'}`}
          >
            {status.texto}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {enviando ? 'Cadastrando...' : 'Cadastrar Disciplina'}
        </button>
      </form>
    </section>
  );
}
