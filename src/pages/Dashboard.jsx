import Calendario from './Calendario';
import Timer from '../components/Timer';
import TodoList from '../components/TodoList';

export default function Dashboard() {
    return (
        <main className="px-6 py-8 md:px-12">
            <h1 className="mb-6 text-4xl font-bold text-[#0A1F4D]">Visão Geral</h1>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
                <Calendario />
                <Timer />
            </div>

            <div className="mt-6">
                <TodoList />
            </div>
        </main>
    );
}