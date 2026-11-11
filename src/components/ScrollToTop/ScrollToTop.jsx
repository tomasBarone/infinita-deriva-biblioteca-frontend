import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // reseteo estándar al cambiar de ruta
    window.scrollTo(0, 0);

    // desactiva la restauración automática del scroll del navegador
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, [pathname]);

  // forzar el scroll arriba de todo incluso si el usuario actualiza 
  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });

  return null;
}

export default ScrollToTop;