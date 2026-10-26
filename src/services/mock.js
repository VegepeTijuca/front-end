// Ajudantes para rodar o front sem backend.
// Sem VITE_API_URL definida, os services usam dados em memória.
// Quando o backend existir, defina VITE_API_URL no .env e o código real passa a ser usado.
export const USE_MOCK = !import.meta.env.VITE_API_URL;

export const atraso = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

let seq = 0;
export const novoId = () => `mock-${Date.now().toString(36)}-${++seq}`;

// erro no mesmo formato do axios, para os componentes lerem err.response?.data?.message
export function erroApi(message, status = 400) {
  const err = new Error(message);
  err.response = { status, data: { message } };
  return err;
}
