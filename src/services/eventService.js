import api from './api';

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

export async function listar() {
  const { data } = await api.get('/eventos');
  return data.map(deApi);
}

export async function criar(evento) {
  const { data } = await api.post('/eventos', paraApi(evento));
  return deApi(data);
}

export async function atualizar(id, evento) {
  const { data } = await api.put(`/eventos/${id}`, paraApi(evento));
  return deApi(data);
}

export async function remover(id) {
  await api.delete(`/eventos/${id}`);
}
