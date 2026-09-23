"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT_EXPO } from "./motion/Primitives";

export const SECTIONS = [
  { id: "nuestro-cafe", n: "01", label: "Nuestro café" },
  { id: "por-que-existimos", n: "02", label: "Por qué existimos" },
  { id: "corona", n: "03", label: "La corona de laurel" },
  { id: "origen", n: "04", label: "Origen" },
  { id: "proceso", n: "05", label: "Nuestro proceso" },
];

export function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function SiteNav() {
  const [open, setOpen] = useState(false);

  const jump = (id: string) => {
    setOpen(false);
    // deja cerrar el overlay antes de desplazar
    setTimeout(() => goTo(id), open ? 420 : 0);
  };

  return (
    <>
      {/* mix-blend-difference: el nav se invierte solo sobre fondos claros u oscuros */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] mix-blend-difference">
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="pointer-events-auto micro text-cream"
          >
            Café Laurel
          </button>

          <nav className="pointer-events-auto hidden items-center gap-7 lg:flex">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => jump(s.id)}
                className="group flex items-baseline gap-1.5"
              >
                <span className="font-sans text-[0.6rem] text-cream/50">{s.n}</span>
                <span className="micro text-cream transition-opacity group-hover:opacity-60">
                  {s.label}
                </span>
              </button>
            ))}
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="pointer-events-auto micro text-cream lg:hidden"
          >
            {open ? "Cerrar" : "Menú"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col justify-center bg-ink px-6 lg:hidden"
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
