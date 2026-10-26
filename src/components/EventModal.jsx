import { useEffect, useRef, useState } from 'react';

/**
 * Modal para criar, editar e excluir eventos (usa o <dialog> nativo:
 * prende o foco, fecha com Esc e devolve o foco ao fechar).
 *
 * Props:
 * - initial:  { id?, title, date, time }  (date = 'YYYY-MM-DD', time = 'HH:mm' ou '')
 * - onSave:   (dados) => void
 * - onDelete: (id) => void   (só aparece ao editar)
 * - onClose:  () => void
 * - erro:     mensagem vinda do servidor (opcional)
 * - salvando: true enquanto a requisição está em andamento
 */
export default function EventModal({ initial, onSave, onDelete, onClose, erro = '', salvando = false }) {
    const [title, setTitle] = useState(initial.title ?? '');
    const [date, setDate] = useState(initial.date ?? '');
    const [time, setTime] = useState(initial.time ?? '');
    const [erroLocal, setErroLocal] = useState('');

    const dialogRef = useRef(null);
    const comecouNoFundo = useRef(false);

    const isEditing = Boolean(initial.id);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog && !dialog.open) dialog.showModal();
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        const cleanTitle = title.trim();

        if (!cleanTitle) {
            setErroLocal('Informe um título para o evento.');
            return;
        }
        if (!date) {
            setErroLocal('Informe a data do evento.');
            return;
        }

        setErroLocal('');
        onSave({ id: initial.id, title: cleanTitle, date, time });
    }

    const mensagem = erroLocal || erro;

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="event-modal-title"
            // Esc: deixa o pai desmontar o modal
            onCancel={(e) => {
                e.preventDefault();
                onClose();
            }}
            // só fecha se o clique COMEÇOU e TERMINOU no fundo (arrastar texto não fecha)
            onMouseDown={(e) => {
                comecouNoFundo.current = e.target === e.currentTarget;
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget && comecouNoFundo.current) onClose();
            }}
            className="m-auto w-full max-w-md rounded-3xl bg-transparent p-0 backdrop:bg-slate-900/40"
        >
            <form onSubmit={handleSubmit} noValidate className="rounded-3xl bg-white p-6 shadow-2xl">
                <h3 id="event-modal-title" className="mb-5 text-xl font-bold text-[#0A1F4D]">
                    {isEditing ? 'Editar evento' : 'Novo evento'}
                </h3>

                <label className="mb-4 block">
                    <span className="mb-1 block text-sm font-semibold text-slate-700">Título</span>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex.: prova de matemática"
                        required
                        className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-800 outline-none focus:border-[#3349D6] focus:ring-2 focus:ring-[#3349D6]/20"
                    />
                </label>

                <div className="mb-6 grid grid-cols-2 gap-3">
                    <label className="block">
                        <span className="mb-1 block text-sm font-semibold text-slate-700">Data</span>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-[#3349D6] focus:ring-2 focus:ring-[#3349D6]/20"
                        />
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-sm font-semibold text-slate-700">
                            Hora <span className="font-normal text-slate-400">(opcional)</span>
                        </span>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-[#3349D6] focus:ring-2 focus:ring-[#3349D6]/20"
                        />
                    </label>
                </div>

                {mensagem && (
                    <p role="alert" className="mb-4 text-sm text-red-600">
                        {mensagem}
                    </p>
                )}

                <div className="flex items-center gap-3">
                    {isEditing && (
                        <button
                            type="button"
                            disabled={salvando}
                            onClick={() => onDelete(initial.id)}
                            className="h-11 rounded-xl px-4 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                            Excluir
                        </button>
                    )}
                    <div className="ml-auto flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-11 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={salvando}
                            className="h-11 rounded-xl bg-[#0A1F4D] px-6 text-sm font-semibold text-white hover:bg-[#12306e] disabled:opacity-60"
                        >
                            {salvando ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </div>
            </form>
        </dialog>
    );
}
