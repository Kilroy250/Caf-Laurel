"use client";

import { createContext, useContext, type RefObject } from "react";
import type { MotionValue } from "framer-motion";

/**
 * intro    — la intro ocupa la pantalla y el scroll conduce la transición
 * arrived  — los elementos reales tomaron el relevo; se absorbe la inercia del scroll
 * released — la intro desaparece y la página se desplaza con normalidad
 */
export type IntroPhase = "intro" | "arrived" | "released";

/** Recorrido de scroll virtual (px de rueda) que completa la transición. */
export const INTRO_RANGE = 520;

/**
 * Toda animación de la transición termina en o antes de este punto del
 * progreso; el relevo ocurre al cruzarlo. Así no queda una cola del resorte
 * en la que nada se mueve pero la página sigue bloqueada.
 */
export const INTRO_DONE = 0.92;

export type IntroState = {
  phase: IntroPhase;
  /** 0 → 1, suavizado con resorte. */
  progress: MotionValue<number>;
  /** Donde aterriza el logotipo: la columna izquierda de la portada. */
  heroLogoRef: RefObject<HTMLDivElement | null>;
  /** Donde aterriza el campesino: el centro de la barra superior. */
  navMarkRef: RefObject<HTMLDivElement | null>;
};

export const IntroContext = createContext<IntroState | null>(null);

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useIntro debe usarse dentro de <Experience>");
  return ctx;
}
