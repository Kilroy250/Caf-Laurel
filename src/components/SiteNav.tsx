"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useTransform } from "framer-motion";
import { CosecheroIcon } from "./CosecheroIcon";
import { EASE_OUT_EXPO } from "./motion/Primitives";
import { useIntro } from "./intro-context";

// `n` es el número que lleva la sección en la página, no la posición en el menú
const TABS = [
  { id: "nuestro-cafe", n: "01", label: "Nuestro café" },
  { id: "origen", n: "03", label: "Origen" },
  { id: "corona", n: "04", label: "La corona de laurel" },
  { id: "proceso", n: "05", label: "Nuestro proceso" },
];

const IZQUIERDA = TABS.slice(0, 2);
const DERECHA = TABS.slice(2);

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
        {/* --g: la misma separación entre las cuatro pestañas y el campesino; los 9.8px descuentan el aire transparente del dibujo (17,5 % de su caja de 56px) */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-6 py-4 [--g:clamp(2rem,6.5vw,7.5rem)] sm:px-10">
          <motion.div
            style={{ opacity: chromeOpacity, y: chromeY }}
            className="flex items-center"
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

            <div className="ml-auto hidden items-center gap-[var(--g)] pr-[calc(var(--g)-9.8px)] lg:flex">
              {IZQUIERDA.map((s) => (
                <button
                  key={s.id}
                  onClick={() => jump(s.id)}
                  className="pointer-events-auto micro whitespace-nowrap text-[0.8125rem] normal-case tracking-[0.01em] text-cream transition-opacity hover:opacity-60"
                >
                  {s.label}
                </button>
              ))}
            </div>
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
            className="flex items-center justify-end lg:justify-start"
          >
            <div className="hidden items-center gap-[var(--g)] pl-[calc(var(--g)-9.8px)] lg:flex">
              {DERECHA.map((s) => (
                <button
                  key={s.id}
                  onClick={() => jump(s.id)}
                  className="pointer-events-auto micro whitespace-nowrap text-[0.8125rem] normal-case tracking-[0.01em] text-cream transition-opacity hover:opacity-60"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setOpen((v) => !v)}
              className="pointer-events-auto micro text-[0.8125rem] normal-case tracking-[0.01em] text-cream lg:hidden"
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
            {TABS.map((s, i) => (
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
