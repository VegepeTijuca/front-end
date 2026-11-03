// Ícone de traço simples (caminhos em data/ajuda.js).
export default function Icone({ d, className = 'h-5 w-5', strokeWidth = 1.8 }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
