// Ajudantes para rodar o front sem backend.
//
// Estes services AINDA NÃO têm rota/tabela compatível no backend, então ficam em memória:
//   eventService (calendário), todoService (tarefas), timerService (sessão ativa),
//   usuarioService (preferências).
// Quando o backend tiver as rotas, troque para false (ou crie uma flag por service).
export const USE_MOCK = true;

export const atraso = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

let seq = 0;
export const novoId = () => `mock-${Date.now().toString(36)}-${++seq}`;

export function erroApi(message, status = 400) {
  const err = new Error(message);
  err.response = { status, data: { message } };
  return err;
}
