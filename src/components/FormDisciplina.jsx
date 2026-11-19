import { useId, useState } from 'react';
import { criarDisciplinas } from '../services/disciplinaService';
import Modal from './Modal';

const campoClasses =
  'block w-full cursor-text rounded-xl border border-transparent bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#004A8F] focus:bg-white focus:ring-4 focus:ring-[#004A8F]/15 disabled:cursor-not-allowed';

// Modal "Nova disciplina". Quem usa decide quando mostrar: {aberto && <FormDisciplina ... />}
export default function FormDisciplina({ onFechar, onCriada }) {
  const idBase = useId();
  const [disciplina, setDisciplina] = useState({ name: '', descricao: '' });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setDisciplina((atual) => ({ ...atual, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setErro('');

    try {
      await criarDisciplinas({
        name: disciplina.name.trim(),
        descricao: disciplina.descricao.trim(),
      });
      onCriada?.();
      onFechar();
    } catch (err) {
      const msg = err.response?.data?.error;
      setErro((typeof msg === 'string' ? msg : msg?.message) ?? 'Não foi possível cadastrar a disciplina.');
      setEnviando(false);
    }
  }

  // não deixa fechar enquanto está enviando
  const fechar = () => {
    if (!enviando) onFechar();
  };

  return (
    <Modal
      titulo="Nova disciplina"
      onFechar={fechar}
      rodape={
        <>
          <button
            type="button"
            onClick={fechar}
            disabled={enviando}
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form={`${idBase}-form`}
            disabled={enviando}
            className="cursor-pointer rounded-xl bg-[#004A8F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003B73] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#004A8F] disabled:active:scale-100"
          >
            {enviando ? 'Cadastrando...' : 'Cadastrar disciplina'}
          </button>
        </>
      }
    >
      <form id={`${idBase}-form`} onSubmit={handleSubmit} className="space-y-5">
        <p className="-mt-2 text-sm text-slate-500">
          Cadastre a matéria. Os conteúdos (ex.: trigonometria) você adiciona dentro dela depois.
        </p>

        <div className="space-y-1.5">
          <label htmlFor={`${idBase}-name`} className="block text-sm font-semibold text-slate-900">
            Nome da disciplina
          </label>
          <input
            type="text"
            id={`${idBase}-name`}
            name="name"
            data-autofocus
            placeholder="Ex.: Matemática"
            value={disciplina.name}
            onChange={handleChange}
            required
            className={campoClasses}
          />
        </div>

        <div className="space-y-1.5">
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
            className={campoClasses}
          />
        </div>

        {erro && (
          <p
            role="alert"
            className="rounded-2xl bg-tj-orange/10 px-4 py-3 text-sm font-medium text-[#A85A00] ring-1 ring-tj-orange/25"
          >
            {erro}
          </p>
        )}
      </form>
    </Modal>
  );
}
