"use client";

import { useEffect } from "react";

/**
 * Safari 26 (iPhone) ya no usa theme-color: pinta la zona de la hora y la barra de abajo
 * con el color de fondo de <html>/<body> (y de los elementos fijos). Como esta página
 * alterna secciones crema y oscuras, ese fondo se pone del color de la sección que está
 * en el borde de abajo de la pantalla; así las barras siempre coinciden con lo que hay
 * detrás y no aparece una franja de otro color. Sin transición: cambia al instante.
 */
export function FondoSafari() {
  useEffect(() => {
    const raiz = document.documentElement;
    const cuerpo = document.body;
    let frame = 0;
    let actual = "";

    const sincronizar = () => {
      frame = 0;
      const y = window.scrollY + window.innerHeight - 1;
      const secciones = document.querySelectorAll<HTMLElement>("main > section, footer");
      for (const s of secciones) {
        const top = s.getBoundingClientRect().top + window.scrollY;
        if (y >= top && y < top + s.offsetHeight) {
          const color = getComputedStyle(s).backgroundColor;
          if (color !== actual && color !== "rgba(0, 0, 0, 0)") {
            actual = color;
            raiz.style.backgroundColor = color;
            cuerpo.style.backgroundColor = color;
          }
          return;
        }
      }
    };
    const programar = () => {
      if (!frame) frame = requestAnimationFrame(sincronizar);
    };

    sincronizar();
    window.addEventListener("scroll", programar, { passive: true });
    window.addEventListener("resize", programar);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", programar);
      window.removeEventListener("resize", programar);
    };
  }, []);

  return null;
}
