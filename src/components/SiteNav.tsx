"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useTransform } from "framer-motion";
import { CosecheroIcon } from "./CosecheroIcon";
import { EASE_OUT_EXPO } from "./motion/Primitives";
import { useIntro } from "./intro-context";

export const SECTIONS = [
  { id: "nuestro-cafe", n: "01", label: "Nuestro café" },
  { id: "por-que-existimos", n: "02", label: "Por qué existimos" },
  { id: "corona", n: "03", label: "La corona de laurel" },
  { id: "origen", n: "04", label: "Origen" },
  { id: "proceso", n: "05", label: "Nuestro proceso" },
];

const IZQUIERDA = SECTIONS.slice(0, 2);
const DERECHA = SECTIONS.slice(2);

export function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function SiteNav() {
  const { phase, progress, navMarkRef } = useIntro();
  const [open, setOpen] = useState(false);

  // las pestañas aparecen en el último tramo de la transición de entrada
  const chromeOpacity = useTransform(progress, [0.5, 0.9], [0, 1]);
  const chromeY = useTransform(progress, [0.5, 0.9], [-8, 0]);
  const markVisible = phase !== "intro";

  const jump = (id: string) => {
    setOpen(false);
    setTimeout(() => goTo(id), open ? 420 : 0);
  };

  const inicio = () => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* mix-blend-difference invierte la barra sola sobre fondos claros u oscuros */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[90] mix-blend-difference">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-6 py-4 sm:px-10">
          <motion.div
            style={{ opacity: chromeOpacity, y: chromeY }}
            className="flex items-center gap-5"
          >
            <button onClick={inicio} className="pointer-events-auto shrink-0">
              <Image
                src="/images/logo-cafe-laurel-blanco.png"
                alt="Café Laurel — ir al inicio"
                width={760}
                height={307}
                className="h-7 w-auto sm:h-8"
              />
            </button>

            {IZQUIERDA.map((s) => (
              <button
                key={s.id}
                onClick={() => jump(s.id)}
                className="pointer-events-auto hidden micro whitespace-nowrap tracking-[0.16em] text-cream transition-opacity hover:opacity-60 lg:block"
              >
                {s.label}
              </button>
            ))}
          </motion.div>

          {/* el espacio del campesino existe siempre: las pestañas no se mueven cuando aterriza */}
          <div ref={navMarkRef} className="h-11 w-11 sm:h-14 sm:w-14">
            <button
              onClick={inicio}
              aria-label="Ir al inicio"
              tabIndex={markVisible ? 0 : -1}
              style={{ opacity: markVisible ? 1 : 0 }}
              className="pointer-events-auto block h-full w-full text-cream"
            >
              <CosecheroIcon className="h-full w-full" />
            </button>
          </div>

          <motion.div
            style={{ opacity: chromeOpacity, y: chromeY }}
            className="flex items-center justify-end gap-5"
          >
            {DERECHA.map((s) => (
              <button
                key={s.id}
                onClick={() => jump(s.id)}
                className="pointer-events-auto hidden micro whitespace-nowrap tracking-[0.16em] text-cream transition-opacity hover:opacity-60 lg:block"
              >
                {s.label}
              </button>
            ))}

            <button
              onClick={() => setOpen((v) => !v)}
              className="pointer-events-auto micro text-cream lg:hidden"
            >
              {open ? "Cerrar" : "Menú"}
            </button>
          </motion.div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[85] flex flex-col justify-center bg-ink px-6 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            {SECTIONS.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => jump(s.id)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: EASE_OUT_EXPO }}
                className="flex items-baseline gap-4 border-b border-cream/10 py-5 text-left"
              >
                <span className="font-sans text-xs text-rust">{s.n}</span>
                <span className="display text-[clamp(1.75rem,9vw,3rem)] text-cream">
                  {s.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
