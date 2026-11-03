import api from './api';
import { USE_MOCK, atraso } from './mock';
import { dataRelativa, ehVisitante, gravarLocal, lerLocal, novoIdLocal } from './visitante';

const pad = (n) => String(n).padStart(2, '0');

// O calendário trabalha com horário local ('YYYY-MM-DD' ou 'YYYY-MM-DDTHH:mm').
// Eventos com hora vão para o backend em ISO (UTC) e voltam convertidos para o horário local.
function paraLocal(start, allDay) {
  if (typeof start !== 'string') return start;
  if (allDay) return start.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(start)) return start;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(start)) return start;

  const d = new Date(start);
  if (Number.isNaN(d.getTime())) return start;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// AJUSTE AQUI: o que o backend devolve -> formato do calendário.
function deApi(ev) {
  const allDay = Boolean(ev.allDay);
  return {
    id: ev.id ?? ev._id,
    title: ev.title,
    start: paraLocal(ev.start, allDay),
    allDay,
  };
}

// AJUSTE AQUI: o que o backend espera receber.
function paraApi({ title, start, allDay }) {
  return {
    title,
    start: allDay ? start : new Date(start).toISOString(),
    allDay,
  };
}

// --- dados locais (sem backend, ou no modo visitante) ---
// guardados já no formato do calendário (horário local) no localStorage
const usaLocal = () => USE_MOCK || ehVisitante();

const eventosIniciais = () =>
  ehVisitante()
    ? [
        { id: novoIdLocal(), title: 'Prova de Matemática', start: dataRelativa(3, '08:00'), allDay: false },
        { id: novoIdLocal(), title: 'Entregar trabalho de História', start: dataRelativa(5), allDay: true },
        { id: novoIdLocal(), title: 'Revisão de Português', start: dataRelativa(1, '19:30'), allDay: false },
      ]
    : [];

const lerEventos = () => lerLocal('eventos', eventosIniciais);

export async function listar() {
  if (usaLocal()) {
    await atraso(100);
    return lerEventos();
  }

  const { data } = await api.get('/eventos');
  return data.map(deApi);
}

export async function criar(evento) {
  if (usaLocal()) {
    await atraso(100);
    const novo = { id: novoIdLocal(), title: evento.title, start: evento.start, allDay: Boolean(evento.allDay) };
    gravarLocal('eventos', [...lerEventos(), novo]);
    return { ...novo };
  }

  const { data } = await api.post('/eventos', paraApi(evento));
  return deApi(data);
}

export async function atualizar(id, evento) {
  if (usaLocal()) {
    await atraso(100);
    const atualizado = { id, title: evento.title, start: evento.start, allDay: Boolean(evento.allDay) };
    gravarLocal('eventos', lerEventos().map((ev) => (ev.id === id ? atualizado : ev)));
    return { ...atualizado };
  }

  const { data } = await api.put(`/eventos/${id}`, paraApi(evento));
  return deApi(data);
}

export async function remover(id) {
  if (usaLocal()) {
    await atraso(100);
    gravarLocal('eventos', lerEventos().filter((ev) => ev.id !== id));
    return;
  }

  await api.delete(`/eventos/${id}`);
}
