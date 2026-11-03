import { useCallback, useState } from 'react';
import Calendario from './Calendario';
import Timer from '../components/Timer';
import TodoList from '../components/TodoList';
import ResumoRapido from '../components/ResumoRapido';
import CabecalhoPagina from '../components/CabecalhoPagina';

// atraso (em ms) para cada bloco entrar um depois do outro
const atraso = (ms) => ({ animationDelay: `${ms}ms` });

export default function Dashboard() {
    // sobe 1 sempre que algo muda no calendário ou nas tarefas, para o resumo se atualizar
    const [versao, setVersao] = useState(0);
    const aoMudar = useCallback(() => setVersao((v) => v + 1), []);

    return (
        <main className="px-6 py-8 md:px-12">
            <CabecalhoPagina
                titulo="Visão Geral"
                descricao="Seu dia em um só lugar: compromissos, foco e tarefas."
                ajuda="dashboard"
            />

            <ResumoRapido versao={versao} />

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_1fr]">
                <div className="min-w-0 animate-fade-up" style={atraso(60)}>
                    <Calendario onMudou={aoMudar} />
                </div>
                <div className="animate-fade-up" style={atraso(140)}>
                    <Timer />
                </div>
            </div>

            <div className="mt-6 animate-fade-up" style={atraso(220)}>
                <TodoList onMudou={aoMudar} />
            </div>
        </main>
    );
}
