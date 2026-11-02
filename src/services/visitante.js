// Modo visitante: entrar no app sem conta e sem API.
//
// Enquanto estiver no modo visitante, os services não chamam a API: leem e gravam os dados
// no localStorage deste navegador (com alguns dados de exemplo na primeira vez).
//
// Para desligar de vez (por exemplo, quando a API estiver no ar), troque para false:
// o botão some e o modo deixa de funcionar.
export const PERMITIR_VISITANTE = true;

const CHAVE_FLAG = 'classme:visitante';
const PREFIXO_DADOS = 'classme:local:';

export const USUARIO_VISITANTE = { name: 'Visitante', role: 'Modo visitante' };

export function ehVisitante() {
  if (!PERMITIR_VISITANTE) return false;
  try {
    return localStorage.getItem(CHAVE_FLAG) === '1';
  } catch {
    return false;
  }
}

export function ativarVisitante() {
  try {
    localStorage.setItem(CHAVE_FLAG, '1');
  } catch {
    /* sem localStorage: o modo visitante vale só até recarregar */
  }
}

export function desativarVisitante() {
  try {
    localStorage.removeItem(CHAVE_FLAG);
  } catch {
    /* ignora */
  }
}

// ---------- armazenamento local ----------

// Lê uma lista/objeto salvo. Se ainda não existe, grava e devolve o valor de "inicial()".
export function lerLocal(nome, inicial) {
  try {
    const salvo = localStorage.getItem(PREFIXO_DADOS + nome);
    if (salvo !== null) return JSON.parse(salvo);
  } catch {
    /* dado corrompido ou sem localStorage: cai no valor inicial */
  }
  const valor = inicial();
  gravarLocal(nome, valor);
  return valor;
}

export function gravarLocal(nome, valor) {
  try {
    localStorage.setItem(PREFIXO_DADOS + nome, JSON.stringify(valor));
  } catch {
    /* ignora */
  }
}

// Apaga tudo o que foi salvo localmente (usado no botão de Configurações).
export function apagarDadosLocais() {
  try {
    Object.keys(localStorage)
      .filter((chave) => chave.startsWith(PREFIXO_DADOS))
      .forEach((chave) => localStorage.removeItem(chave));
  } catch {
    /* ignora */
  }
}

// ---------- ajudantes para os dados de exemplo ----------

let seq = 0;
export const novoIdLocal = () => `local-${Date.now().toString(36)}-${++seq}`;

const pad = (n) => String(n).padStart(2, '0');

// 'YYYY-MM-DD' (ou 'YYYY-MM-DDTHH:mm' se passar a hora) de hoje + N dias
export function dataRelativa(dias, hora = '') {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  const dia = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return hora ? `${dia}T${hora}` : dia;
}
