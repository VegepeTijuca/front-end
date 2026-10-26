import { useCallback, useEffect, useState } from 'react';
import FullCalendar, { useCalendarController } from '@fullcalendar/react';
import themePlugin from '@fullcalendar/react/themes/monarch';
import dayGridPlugin from '@fullcalendar/react/daygrid';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import listPlugin from '@fullcalendar/react/list';
import interactionPlugin from '@fullcalendar/react/interaction';
import ptBrLocale from '@fullcalendar/react/locales/pt-br';

// stylesheets
import '@fullcalendar/react/skeleton.css'; // sempre necessário
import '@fullcalendar/react/themes/monarch/theme.css';
import '@fullcalendar/react/themes/monarch/palettes/purple.css';

import EventModal from '../components/EventModal';
import { atualizar, criar, listar, remover } from '../services/eventService';

const PLUGINS = [themePlugin, dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin];

const VIEWS = [
    { type: 'dayGridMonth', label: 'Mês' },
    { type: 'timeGridWeek', label: 'Semana', desktopOnly: true },
    { type: 'timeGridDay', label: 'Dia' },
    { type: 'listWeek', label: 'Lista' },
];

/* ---------------------------- helpers ---------------------------- */

// 'YYYY-MM-DD' (ou 'YYYY-MM-DDTHH:mm') -> { date, time }
function splitDateStr(str) {
    return { date: str.slice(0, 10), time: str.length > 10 ? str.slice(11, 16) : '' };
}

const todayStr = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/* ----------------------------- botões ---------------------------- */

function IconButton({ label, onClick, className = '', children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            title={label}
            className={`h-9 w-9 place-items-center rounded-lg bg-slate-100 text-lg font-bold leading-none text-[#0A1F4D] transition-colors hover:bg-slate-200 ${
                className || 'grid'
            }`}
        >
            {children}
        </button>
    );
}

export default function Calendario() {
    const controller = useCalendarController();

    // no celular, começa na lista da semana (mais legível que a grade do mês)
    const [initialView] = useState(() =>
        window.matchMedia('(max-width: 639px)').matches ? 'listWeek' : 'dayGridMonth'
    );

    const [events, setEvents] = useState([]);
    const [modal, setModal] = useState(null); // null | { id?, title, date, time }
    const [erroLista, setErroLista] = useState('');
    const [erroModal, setErroModal] = useState('');
    const [salvando, setSalvando] = useState(false);

    // carrega os eventos do backend
    useEffect(() => {
        let cancelado = false;

        listar()
            .then((lista) => {
                if (!cancelado) setEvents(lista);
            })
            .catch(() => {
                if (!cancelado) setErroLista('Não foi possível carregar os eventos.');
            });

        return () => {
            cancelado = true;
        };
    }, []);

    /* ---- interações do calendário ---- */

    const handleDateClick = useCallback((info) => {
        const { date, time } = splitDateStr(info.dateStr);
        setErroModal('');
        setModal({ title: '', date, time });
    }, []);

    const handleEventClick = useCallback(
        (info) => {
            const found = events.find((ev) => ev.id === info.event.id);
            if (!found) return;
            const { date, time } = splitDateStr(found.start);
            setErroModal('');
            setModal({ id: found.id, title: found.title, date, time: found.allDay ? '' : time });
        },
        [events]
    );

    /* ---- salvar / excluir ---- */

    async function saveEvent({ id, title, date, time }) {
        const start = time ? `${date}T${time}` : date;
        const data = { title, start, allDay: !time };

        setSalvando(true);
        setErroModal('');
        try {
            if (id) {
                const atualizado = await atualizar(id, data);
                setEvents((list) => list.map((ev) => (ev.id === id ? atualizado : ev)));
            } else {
                const novo = await criar(data);
                setEvents((list) => [...list, novo]);
            }
            setModal(null);
        } catch {
            setErroModal('Não foi possível salvar o evento. Tente novamente.');
        } finally {
            setSalvando(false);
        }
    }

    async function deleteEvent(id) {
        setSalvando(true);
        setErroModal('');
        try {
            await remover(id);
            setEvents((list) => list.filter((ev) => ev.id !== id));
            setModal(null);
        } catch {
            setErroModal('Não foi possível excluir o evento. Tente novamente.');
        } finally {
            setSalvando(false);
        }
    }

    const fecharModal = useCallback(() => setModal(null), []);

    const activeView = controller.view?.type;

    return (
        <section className="min-w-0 overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_10px_40px_rgba(15,23,42,0.08)] sm:p-6">
            {/* linha 1: título + navegação */}
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="min-w-0 truncate text-lg font-bold capitalize text-[#0A1F4D]">
                    {controller.view?.title}
                </h2>

                <div className="flex shrink-0 items-center gap-1.5">
                    <IconButton label="Ano anterior" onClick={() => controller.prevYear()} className="hidden sm:grid">
                        «
                    </IconButton>
                    <IconButton label="Anterior" onClick={() => controller.prev()}>
                        ‹
                    </IconButton>
                    <button
                        type="button"
                        onClick={() => controller.today()}
                        className="h-9 rounded-lg bg-slate-100 px-3 text-sm font-semibold text-[#0A1F4D] transition-colors hover:bg-slate-200"
                    >
                        Hoje
                    </button>
                    <IconButton label="Próximo" onClick={() => controller.next()}>
                        ›
                    </IconButton>
                    <IconButton label="Próximo ano" onClick={() => controller.nextYear()} className="hidden sm:grid">
                        »
                    </IconButton>
                </div>
            </div>

            {/* linha 2: ir para data + visualização + novo evento */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <input
                    type="date"
                    aria-label="Ir para a data"
                    onChange={(e) => e.target.value && controller.gotoDate(e.target.value)}
                    className="h-9 rounded-lg border border-slate-200 px-2 text-sm text-slate-700 outline-none focus:border-[#3349D6]"
                />

                <div className="flex rounded-lg bg-slate-100 p-0.5">
                    {VIEWS.map((v) => (
                        <button
                            key={v.type}
                            type="button"
                            onClick={() => controller.changeView(v.type)}
                            aria-pressed={activeView === v.type}
                            className={`h-8 rounded-md px-3 text-sm font-semibold transition-colors ${
                                v.desktopOnly ? 'hidden sm:block' : ''
                            } ${
                                activeView === v.type
                                    ? 'bg-[#0A1F4D] text-white'
                                    : 'text-slate-600 hover:text-[#0A1F4D]'
                            }`}
                        >
                            {v.label}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => setModal({ title: '', date: todayStr(), time: '' })}
                    className="ml-auto h-9 rounded-lg bg-[#3349D6] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#2a3dbb]"
                >
                    + Novo evento
                </button>
            </div>

            {erroLista && (
                <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erroLista}
                </p>
            )}

            <FullCalendar
                controller={controller}
                plugins={PLUGINS}
                locale={ptBrLocale}
                initialView={initialView}
                headerToolbar={false}
                navLinks
                nowIndicator
                dayMaxEvents={3}
                height="auto"
                events={events}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
            />

            {modal && (
                // key remonta o formulário quando troca o evento aberto
                <EventModal
                    key={modal.id ?? `${modal.date}-${modal.time}`}
                    initial={modal}
                    onSave={saveEvent}
                    onDelete={deleteEvent}
                    onClose={fecharModal}
                    erro={erroModal}
                    salvando={salvando}
                />
            )}
        </section>
    );
}