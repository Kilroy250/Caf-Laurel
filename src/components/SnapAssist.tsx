"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { useIntro } from "./intro-context";
import { PIN_QUERY } from "./useMediaQuery";

/** Qué tan cerca (fracción del alto de pantalla) hay que quedar para que el encuadre atraiga. */
const UMBRAL = 0.08;
/** Tiempo sin scroll que cuenta como "soltó" (incluye la inercia del trackpad). */
const QUIETO_MS = 160;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Imán suave hacia los encuadres (elementos con la clase pin:snap-start).
 * Reemplaza al scroll-snap nativo, que atrae desde lejos y salta brusco:
 * aquí solo actúa si al soltar el scroll quedaste muy cerca de un encuadre,
 * se desliza con una curva suave y se cancela en cuanto vuelves a mover.
 */
export function SnapAssist() {
  const { phase } = useIntro();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (phase !== "released" || reduce) return;
    const mq = window.matchMedia(PIN_QUERY);

    let timer = 0;
    let frame = 0;
    let animando = false;

    const cancelar = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      animando = false;
    };

    const deslizarA = (destino: number) => {
      const inicio = window.scrollY;
      const distancia = destino - inicio;
      const duracion = Math.min(750, 380 + Math.abs(distancia) * 1.4);
      const t0 = performance.now();
      animando = true;
      const paso = (ahora: number) => {
        const t = Math.min(1, (ahora - t0) / duracion);
        window.scrollTo({ top: inicio + distancia * easeInOut(t), behavior: "instant" });
        if (t < 1) frame = requestAnimationFrame(paso);
        else cancelar();
      };
      frame = requestAnimationFrame(paso);
    };

    const alSoltar = () => {
      // pantalla chica, pedido abierto, o ya estamos deslizando: no hacer nada
      if (!mq.matches || animando || document.documentElement.style.overflow === "hidden") return;
      const y = window.scrollY;
      const umbral = window.innerHeight * UMBRAL;
      let mejor: number | null = null;
      for (const el of document.querySelectorAll<HTMLElement>(".pin\\:snap-start")) {
        const top = Math.round(el.getBoundingClientRect().top + y);
        const d = Math.abs(top - y);
        if (d > 2 && d < umbral && (mejor === null || d < Math.abs(mejor - y))) mejor = top;
      }
      if (mejor !== null) deslizarA(mejor);
    };

    const onScroll = () => {
      if (animando) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(alSoltar, QUIETO_MS);
    };
    // cualquier gesto nuevo del usuario manda sobre el imán
    const onGesto = () => {
      if (animando) cancelar();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onGesto, { passive: true });
    window.addEventListener("touchstart", onGesto, { passive: true });
    window.addEventListener("keydown", onGesto);
    return () => {
      window.clearTimeout(timer);
      cancelar();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onGesto);
      window.removeEventListener("touchstart", onGesto);
      window.removeEventListener("keydown", onGesto);
    };
  }, [phase, reduce]);

  return null;
}
