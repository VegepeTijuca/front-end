import { useCallback, useSyncExternalStore } from 'react';

// Devolve true enquanto a media query casa, e atualiza quando a tela muda de tamanho.
export default function useMediaQuery(consulta) {
  const assinar = useCallback(
    (aoMudar) => {
      const mq = window.matchMedia(consulta);
      mq.addEventListener('change', aoMudar);
      return () => mq.removeEventListener('change', aoMudar);
    },
    [consulta]
  );

  return useSyncExternalStore(assinar, () => window.matchMedia(consulta).matches);
}
