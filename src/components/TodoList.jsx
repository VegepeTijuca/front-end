import { useEffect, useState } from 'react';
import { atualizar, criar, listar, remover } from '../services/todoService';

export default function TodoList({ onMudou }) {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    // carrega as tarefas do backend
    useEffect(() => {
        let cancelado = false;

        listar()
            .then((lista) => {
                if (!cancelado) setTodos(lista);
            })
            .catch(() => {
                if (!cancelado) setErro('Não foi possível carregar as tarefas.');
            })
            .finally(() => {
                if (!cancelado) setCarregando(false);
            });

        return () => {
            cancelado = true;
        };
    }, []);

    async function addTodo(e) {
        e.preventDefault();
        const value = text.trim();
        if (!value) return;

        setErro('');
        setText('');
        try {
            const nova = await criar(value);
            setTodos((list) => [...list, nova]);
            onMudou?.();
        } catch {
            setText(value);
            setErro('Não foi possível adicionar a tarefa.');
        }
    }

    // atualiza na tela na hora e desfaz se o servidor recusar
    async function update(id, patch) {
        const anterior = todos;
        setErro('');
        setTodos((list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t)));
        try {
            await atualizar(id, patch);
            onMudou?.();
        } catch {
            setTodos(anterior);
            setErro('Não foi possível atualizar a tarefa.');
        }
    }

    async function removeTodo(id) {
        const anterior = todos;
        setErro('');
        setTodos((list) => list.filter((t) => t.id !== id));
        try {
            await remover(id);
            onMudou?.();
        } catch {
            setTodos(anterior);
            setErro('Não foi possível excluir a tarefa.');
        }
    }

    return (
        <section className="rounded-[28px] bg-white px-6 py-8 shadow-[0_10px_40px_rgba(15,23,42,0.08)] sm:px-10">
            <h2 className="text-3xl font-bold text-[#00264D]">To-Do List</h2>
            <p className="mb-5 mt-1 text-sm text-slate-500">
                Marque o quadrado ao concluir. Use a estrela ★ para destacar o que é importante.
            </p>

            {erro && (
                <p role="alert" className="mb-4 rounded-xl bg-tj-orange/10 px-4 py-3 text-sm text-[#A85A00]">
                    {erro}
                </p>
            )}

            {carregando && (
                <p className="py-8 text-center text-sm text-slate-500">Carregando tarefas...</p>
            )}

            {!carregando && todos.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 px-6 py-8 text-center">
                    <p className="font-semibold text-slate-700">Nenhuma tarefa ainda</p>
                    <p className="mt-1 text-sm text-slate-500">Escreva o que precisa fazer no campo abaixo e clique em Adicionar.</p>
                </div>
            )}

            <ul className="flex flex-col gap-5">
                {todos.map((todo, i) => (
                    <li
                        key={todo.id}
                        style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
                        className={`flex h-19 animate-fade-up items-center gap-5 rounded-xl border px-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                            todo.done
                                ? 'border-slate-300 bg-slate-100 text-slate-600'
                                : 'border-slate-200 bg-slate-50/60 text-slate-800'
                        }`}
                    >
                        <button
                            type="button"
                            role="checkbox"
                            aria-checked={todo.done}
                            aria-label={
                                todo.done
                                    ? `Desmarcar "${todo.text}"`
                                    : `Marcar "${todo.text}" como concluída`
                            }
                            onClick={() => update(todo.id, { done: !todo.done })}
                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border ${
                                todo.done ? 'border-[#004A8F] bg-[#004A8F] text-white' : 'border-slate-400 bg-white'
                            }`}
                        >
                            {todo.done && (
                                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>

                        <span className={`flex-1 truncate text-base font-semibold ${todo.done ? 'line-through' : ''}`}>{todo.text}</span>

                        {todo.done ? (
                            <button
                                type="button"
                                onClick={() => removeTodo(todo.id)}
                                aria-label={`Excluir "${todo.text}"`}
                                className="grid h-8 w-14 place-items-center rounded-lg bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
                            >
                                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10M9 9v4M11 9v4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        ) : (
                            <div className="flex items-center gap-5">
                                <button
                                    type="button"
                                    onClick={() => update(todo.id, { starred: !todo.starred })}
                                    aria-label={
                                        todo.starred
                                            ? `Remover "${todo.text}" dos favoritos`
                                            : `Favoritar "${todo.text}"`
                                    }
                                    aria-pressed={todo.starred}
                                    className={`transition-transform hover:scale-125 active:scale-90 ${todo.starred ? 'text-[#00264D]' : 'text-slate-500 hover:text-[#00264D]'}`}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-6 w-6"
                                        fill={todo.starred ? 'currentColor' : 'none'}
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeTodo(todo.id)}
                                    aria-label={`Excluir "${todo.text}"`}
                                    className="grid h-7 w-7 place-items-center rounded-full border border-slate-400 text-slate-600 hover:bg-slate-100 hover:text-[#00264D]"
                                >
                                    <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <form onSubmit={addTodo} className="mt-6 flex gap-3">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Ex.: Resolver a lista de exercícios"
                    aria-label="Nova tarefa"
                    className="h-12 flex-1 rounded-xl border border-slate-200 bg-white px-5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#004A8F] focus:ring-2 focus:ring-[#004A8F]/20"
                />
                <button
                    type="submit"
                    className="h-12 rounded-xl bg-[#004A8F] px-6 text-sm font-semibold text-white transition active:scale-[0.97] hover:bg-[#003B73]"
                >
                    Adicionar
                </button>
            </form>
        </section>
    );
}
