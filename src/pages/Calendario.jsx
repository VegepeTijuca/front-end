import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { IconeCalendario, IconeCheck, IconeRelogio, IconeSino } from '../components/icones';
import { atualizar, criar, listar, remover } from '../services/eventService';

const PLUGINS = [themePlugin, dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin];

const VIEWS = [
    { type: 'dayGridMonth', label: 'Mês' },
    { type: 'timeGridWeek', label: 'Semana', desktopOnly: true },
    { type: 'timeGridDay', label: 'Dia' },
    { type: 'listWeek', label: 'Lista' },
];

// horas no formato 24h (14:30) em todo o calendário
const FORMATO_HORA = { hour: '2-digit', minute: '2-digit', hour12: false };

// Todos os eventos têm a mesma cor. O que muda é o ícone (e o texto) de cada faixa de data.
const COR_EVENTO = '#004A8F';
const FAIXAS = {
    hoje: { texto: 'Hoje', Icone: IconeSino },
    proximo: { texto: 'Próximos 7 dias', Icone: IconeRelogio },
    adiante: { texto: 'Mais adiante', Icone: IconeCalendario },
    passado: { texto: 'Já passou', Icone: IconeCheck },
};

// O texto do evento quebra em várias linhas (em vez de ser cortado com "...").
// O "!" no fim força a regra por cima do CSS do tema do calendário.
const QUEBRA_TEXTO = 'whitespace-normal! break-words! text-left leading-snug';

// Visual de cada evento: hover/foco bem marcados e eventos passados mais apagados.
// (função fora do componente para a referência ficar estável)
function classeDoEvento(info) {
    return [
        'cursor-pointer rounded-md transition duration-150 hover:brightness-95',
        'focus-visible:ring-2 focus-visible:ring-[#00264D] focus-visible:ring-offset-1',
    ].join(' ');
}

// Conteúdo do evento: horário + título completo, e o texto inteiro no tooltip (passar o mouse).
function renderEvento({ event, timeText }) {
    const dica = timeText ? `${timeText} - ${event.title}` : `${event.title} (dia todo)`;

    const { texto, Icone } = FAIXAS[faixaDaData(event.start)];

    return (
        <span title={dica} className={`flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0 ${QUEBRA_TEXTO}`}>
            <Icone className="h-3.5 w-3.5 shrink-0 self-center" />
            <span className="sr-only">{texto}: </span>
            {timeText && <span className="shrink-0 text-[0.85em] font-bold tabular-nums opacity-90">{timeText}</span>}
            <span className="min-w-0 font-semibold">{event.title}</span>
        </span>
    );
}

/* ---------------------------- helpers ---------------------------- */

const pad = (n) => String(n).padStart(2, '0');

// 'YYYY-MM-DD' (ou 'YYYY-MM-DDTHH:mm') -> { date, time }
function splitDateStr(str) {
    return { date: str.slice(0, 10), time: str.length > 10 ? str.slice(11, 16) : '' };
}

const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// 'YYYY-MM-DD' ou 'YYYY-MM-DDTHH:mm' -> Date no horário local
function paraData(str) {
    const [ano, mes, dia] = str.slice(0, 10).split('-').map(Number);
    const [hora, minuto] = str.length > 10 ? str.slice(11, 16).split(':').map(Number) : [0, 0];
    return new Date(ano, mes - 1, dia, hora, minuto);
}

const inicioDoDia = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// altura do calendário na página expandida: ocupa a tela, com um mínimo confortável
const alturaExpandida = () => Math.max(560, window.innerHeight - 230);

// "Hoje", "Amanhã" ou "sex., 14 de nov."
function rotuloDoDia(data) {
    const dias = Math.round((inicioDoDia(data) - inicioDoDia(new Date())) / 86400000);
    if (dias === 0) return 'Hoje';
    if (dias === 1) return 'Amanhã';
    return data.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
}

// qual faixa (chave de FAIXAS) uma data ocupa
function faixaDaData(data) {
    const dias = Math.round((inicioDoDia(data) - inicioDoDia(new Date())) / 86400000);
    if (dias < 0) return 'passado';
    if (dias === 0) return 'hoje';
    if (dias <= 7) return 'proximo';
    return 'adiante';
}

/* ----------------------------- botões ---------------------------- */

function IconButton({ label, onClick, className = '', children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            title={label}
            className={`h-9 w-9 place-items-center rounded-lg bg-slate-100 text-lg font-bold leading-none text-[#00264D] transition hover:bg-slate-200 active:scale-90 ${
                className || 'grid'
            }`}
        >
            {children}
        </button>
    );
}

/* ------------------- painel lateral (página expandida) ------------------- */

function Resumo({ rotulo, valor, Icone }) {
    return (
        <div className="flex flex-col items-center rounded-2xl bg-slate-50 px-4 py-3 text-center text-[#00264D]">
            <Icone className="mb-1 h-5 w-5" />
            <p className="text-2xl font-bold tabular-nums text-[#00264D]">{valor}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{rotulo}</p>
        </div>
    );
}

function PainelEventos({ events, onAbrir, onNovo }) {
    const { hoje, semana, proximos } = useMemo(() => {
        const comeco = inicioDoDia(new Date());
        const fimDaSemana = new Date(comeco);
        fimDaSemana.setDate(fimDaSemana.getDate() + 7);

        const futuros = events
            .map((ev) => ({ ev, data: paraData(ev.start) }))
            .filter(({ data }) => data >= comeco)
            .sort((a, b) => a.data - b.data);

        return {
            hoje: futuros.filter(({ data }) => inicioDoDia(data) - comeco === 0).length,
            semana: futuros.filter(({ data }) => data < fimDaSemana).length,
            proximos: futuros.slice(0, 8),
        };
    }, [events]);

    return (
        <aside className="space-y-5 rounded-[28px] bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.08)] sm:p-6">
            <div className="grid grid-cols-3 gap-3">
                <Resumo rotulo="Hoje" valor={hoje} Icone={IconeSino} />
                <Resumo rotulo="7 dias" valor={semana} Icone={IconeRelogio} />
                <Resumo rotulo="Total" valor={events.length} Icone={IconeCalendario} />
            </div>

            <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Próximos eventos</h3>

                {proximos.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center">
                        <p className="text-sm text-slate-500">Nenhum evento por vir.</p>
                        <button
                            type="button"
                            onClick={onNovo}
                            className="mt-3 text-sm font-semibold text-[#004A8F] hover:underline"
                        >
                            Criar um evento
                        </button>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {proximos.map(({ ev, data }, i) => (
                            <li key={ev.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                                <button
                                    type="button"
                                    onClick={() => onAbrir(ev.id)}
                                    className="flex w-full items-start gap-3 rounded-2xl border border-slate-100 px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-[#004A8F]/40 hover:bg-[#004A8F]/5 hover:shadow-sm"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#00264D] text-center leading-none text-white"
                                    >
                                        <span>
                                            <span className="block text-base font-bold">{data.getDate()}</span>
                                            <span className="block text-[10px] font-semibold uppercase">
                                                {data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                                            </span>
                                        </span>
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block break-words text-sm font-semibold leading-snug text-slate-800">{ev.title}</span>
                                        <span className="block text-xs text-slate-600">
                                            {rotuloDoDia(data)} · {ev.allDay ? 'Dia todo' : `${pad(data.getHours())}:${pad(data.getMinutes())}`}
                                        </span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ul className="space-y-1 text-xs text-slate-600">
                {Object.values(FAIXAS).map(({ texto, Icone }) => (
                    <li key={texto} className="flex items-center gap-2">
                        <Icone className="h-3.5 w-3.5" /> {texto}
                    </li>
                ))}
            </ul>

            <p className="text-xs leading-relaxed text-slate-600">
                Dica: clique em um dia para criar um evento e arraste um evento para mudar a data.
            </p>
        </aside>
    );
}

/* ---------------------------- calendário ---------------------------- */

// expandido = true: versão da página /calendario (maior, com painel de próximos eventos)
export default function Calendario({ expandido = false, onMudou }) {
    const controller = useCalendarController();

    // no celular, começa na lista da semana (mais legível que a grade do mês)
    const [initialView] = useState(() =>
        window.matchMedia('(max-width: 639px)').matches ? 'listWeek' : 'dayGridMonth'
    );

    const [events, setEvents] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [modal, setModal] = useState(null); // null | { id?, title, date, time }
    const [erroLista, setErroLista] = useState('');
    const [erroModal, setErroModal] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [altura, setAltura] = useState(alturaExpandida);

    // carrega os eventos do backend
    useEffect(() => {
        let cancelado = false;

        listar()
            .then((lista) => {
                if (!cancelado) setEvents(lista);
            })
            .catch(() => {
                if (!cancelado) setErroLista('Não foi possível carregar os eventos.');
            })
            .finally(() => {
                if (!cancelado) setCarregando(false);
            });

        return () => {
            cancelado = true;
        };
    }, []);

    // na página expandida, a altura acompanha o tamanho da janela
    useEffect(() => {
        if (!expandido) return;
        const aoRedimensionar = () => setAltura(alturaExpandida());
        window.addEventListener('resize', aoRedimensionar);
        return () => window.removeEventListener('resize', aoRedimensionar);
    }, [expandido]);

    /* ---- abrir o modal ---- */

    const novoEvento = useCallback((date = todayStr(), time = '') => {
        setErroModal('');
        setModal({ title: '', date, time });
    }, []);

    const abrirEvento = useCallback(
        (id) => {
            const found = events.find((ev) => ev.id === id);
            if (!found) return;
            const { date, time } = splitDateStr(found.start);
            setErroModal('');
            setModal({ id: found.id, title: found.title, date, time: found.allDay ? '' : time });
        },
        [events]
    );

    /* ---- interações do calendário ---- */

    const handleDateClick = useCallback(
        (info) => {
            const { date, time } = splitDateStr(info.dateStr);
            novoEvento(date, time);
        },
        [novoEvento]
    );

    const handleEventClick = useCallback((info) => abrirEvento(info.event.id), [abrirEvento]);

    // arrastar um evento para outro dia/horário: salva no servidor e desfaz se der erro
    async function handleEventDrop(info) {
        const original = events.find((ev) => ev.id === info.event.id);
        if (!original) {
            info.revert();
            return;
        }

        const allDay = info.event.allDay;
        const start = allDay ? info.event.startStr.slice(0, 10) : info.event.startStr.slice(0, 16);
        const anteriores = events;

        setErroLista('');
        setEvents((list) => list.map((ev) => (ev.id === original.id ? { ...ev, start, allDay } : ev)));

        try {
            const atualizado = await atualizar(original.id, { title: original.title, start, allDay });
            setEvents((list) => list.map((ev) => (ev.id === original.id ? atualizado : ev)));
            onMudou?.();
        } catch {
            info.revert();
            setEvents(anteriores);
            setErroLista('Não foi possível mover o evento.');
        }
    }

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
            onMudou?.();
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
            onMudou?.();
        } catch {
            setErroModal('Não foi possível excluir o evento. Tente novamente.');
        } finally {
            setSalvando(false);
        }
    }

    const fecharModal = useCallback(() => setModal(null), []);

    const activeView = controller.view?.type;

    // acrescenta a cor de cada evento sem mexer nos dados salvos
    const eventosColoridos = useMemo(
        () => events.map((ev) => ({ ...ev, color: COR_EVENTO })),
        [events]
    );

    return (
        <div className={expandido ? 'grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]' : 'min-w-0'}>
            <section className="min-w-0 overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_10px_40px_rgba(15,23,42,0.08)] sm:p-6">
                {/* linha 1: título + navegação */}
                <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="min-w-0 truncate text-lg font-bold capitalize text-[#00264D]">
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
                            className="h-9 rounded-lg bg-slate-100 px-3 text-sm font-semibold text-[#00264D] transition hover:bg-slate-200 active:scale-95"
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

                {/* linha 2: ir para data + visualização + expandir + novo evento */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <input
                        type="date"
                        aria-label="Ir para a data"
                        onChange={(e) => e.target.value && controller.gotoDate(e.target.value)}
                        className="h-9 rounded-lg border border-slate-200 px-2 text-sm text-slate-700 outline-none transition focus:border-[#004A8F] focus:ring-2 focus:ring-[#004A8F]/20"
                    />

                    <div className="flex rounded-lg bg-slate-100 p-0.5">
                        {VIEWS.map((v) => (
                            <button
                                key={v.type}
                                type="button"
                                onClick={() => controller.changeView(v.type)}
                                aria-pressed={activeView === v.type}
                                className={`h-8 rounded-md px-3 text-sm font-semibold transition-all duration-200 ${
                                    v.desktopOnly ? 'hidden sm:block' : ''
                                } ${
                                    activeView === v.type
                                        ? 'bg-[#00264D] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-[#00264D]'
                                }`}
                            >
                                {v.label}
                            </button>
                        ))}
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        {!expandido && (
                            <Link
                                to="/calendario"
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-100 px-3 text-sm font-semibold text-[#00264D] transition hover:bg-slate-200 active:scale-95"
                            >
                                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                    <path d="M12 3h5v5M8 17H3v-5M17 3l-6 6M3 17l6-6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Expandir
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={() => novoEvento()}
                            className="h-9 rounded-lg bg-[#004A8F] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003B73] active:scale-95"
                        >
                            + Novo evento
                        </button>
                    </div>
                </div>

                {erroLista && (
                    <p role="alert" className="mb-4 animate-pop rounded-xl bg-tj-orange/10 px-4 py-3 text-sm text-[#A85A00]">
                        {erroLista}
                    </p>
                )}

                <div className={`transition-opacity duration-300 ${carregando ? 'opacity-60' : 'opacity-100'}`}>
                    <FullCalendar
                        controller={controller}
                        plugins={PLUGINS}
                        locale={ptBrLocale}
                        initialView={initialView}
                        headerToolbar={false}
                        navLinks
                        nowIndicator
                        editable
                        eventDurationEditable={false}
                        fixedWeekCount={false}
                        // expandido: mostra quantos eventos couberem na caixa do dia e o resto vira "+ mais"
                        dayMaxEvents={expandido ? true : 3}
                        height={expandido ? altura : 'auto'}
                        scrollTime="07:00:00"
                        eventTimeFormat={FORMATO_HORA}
                        slotLabelFormat={FORMATO_HORA}
                        events={eventosColoridos}
                        eventClass={classeDoEvento}
                        eventInnerClass={QUEBRA_TEXTO}
                        eventContent={renderEvento}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        eventDrop={handleEventDrop}
                    />
                </div>
            </section>

            {expandido && <PainelEventos events={events} onAbrir={abrirEvento} onNovo={() => novoEvento()} />}

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
        </div>
    );
}
