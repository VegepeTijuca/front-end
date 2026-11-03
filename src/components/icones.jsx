// Ícones fixos (traço simples). Cada um é um componente com o desenho escrito aqui mesmo.
// Todos são decorativos (aria-hidden): o significado sempre vem junto, escrito em texto.
const props = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const IconePainel = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10" /></svg>
);
export const IconeCalendario = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" /></svg>
);
export const IconeRelogio = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M12 6v6l4 2M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>
);
export const IconeLivro = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z" /></svg>
);
export const IconeTarefa = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M9 11l3 3 8-8M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h9" /></svg>
);
export const IconeEstrela = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" /></svg>
);
export const IconeCheck = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M12 21a9 9 0 100-18 9 9 0 000 18zM8 12.5l3 3 5-6" /></svg>
);
export const IconeSino = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" /></svg>
);
export const IconePlay = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M7 4l13 8-13 8z" /></svg>
);
export const IconePausa = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M8 5v14M16 5v14" /></svg>
);
export const IconeMais = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconeArrastar = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" /></svg>
);
export const IconeInfo = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M12 16v-4M12 8h.01M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>
);
export const IconeAjuda = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>
);
export const IconeUsuario = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" /></svg>
);
export const IconeSair = ({ className = 'h-5 w-5' }) => (
  <svg {...props} className={className}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
);
