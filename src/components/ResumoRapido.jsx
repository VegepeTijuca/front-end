import { useEffect, useState } from 'react';
import { listar as listarEventos } from '../services/eventService';
import { listar as listarTarefas } from '../services/todoService';

const pad = (n) => String(n).padStart(2, '0');

function hojeStr() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// "versao" muda quando o usuário cria/edita algo na tela, e o resumo busca os números de novo
export default function ResumoRapido({ versao = 0 }) {
    const [eventos, setEventos] = useState(null);
    const [tarefas, setTarefas] = useState(null);

    useEffect(() => {
        let cancelado = false;
        // se alguma busca falhar, o número fica "–" (as telas de baixo mostram o erro em detalhe)
        listarEventos().then((l) => !cancelado && setEventos(l)).catch(() => !cancelado && setEventos(null));
        listarTarefas().then((l) => !cancelado && setTarefas(l)).catch(() => !cancelado && setTarefas(null));
        return () => {
            cancelado = true;
        };
    }, [versao]);

    const hoje = eventos ? eventos.filter((ev) => ev.start.slice(0, 10) === hojeStr()).length : '–';
    const pendentes = tarefas ? tarefas.filter((t) => !t.done).length : '–';
    const favoritas = tarefas ? tarefas.filter((t) => !t.done && t.starred).length : '–';
    const concluidas = tarefas ? tarefas.filter((t) => t.done).length : '–';
    const progresso = tarefas && tarefas.length > 0 ? Math.round((concluidas / tarefas.length) * 100) : 0;

    // cada cor tem um significado: laranja = hoje, azul = a fazer, amarelo = favorito, verde = feito
    const cartoes = [
        { rotulo: 'Eventos hoje', valor: hoje, cor: '#F49624', detalhe: 'no calendário' },
        { rotulo: 'Tarefas a fazer', valor: pendentes, cor: '#004A8F', detalhe: 'ainda pendentes' },
        { rotulo: 'Favoritas', valor: favoritas, cor: '#FFC800', detalhe: 'marcadas com estrela' },
        { rotulo: 'Concluídas', valor: concluidas, cor: '#00A651', detalhe: tarefas ? `${progresso}% do total` : '' },
    ];

    return (
        <section aria-label="Resumo do dia" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {cartoes.map((c, i) => (
                <div
                    key={c.rotulo}
                    style={{ borderTopColor: c.cor, animationDelay: `${i * 70}ms` }}
                    className="animate-fade-up rounded-[22px] border-t-4 bg-white px-5 py-4 shadow-[0_10px_40px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.rotulo}</p>
                    <p className="mt-1 text-4xl font-bold tabular-nums text-[#00264D]">{c.valor}</p>
                    <p className="text-xs text-slate-400">{c.detalhe}</p>
                </div>
            ))}
        </section>
    );
}
