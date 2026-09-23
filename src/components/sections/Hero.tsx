"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EASE_OUT_EXPO, MaskedLine, Parallax } from "@/components/motion/Primitives";
import { SECTIONS, goTo } from "@/components/SiteNav";

export function Hero() {
  return (
    <section id="inicio" className="relative flex min-h-screen flex-col bg-cream text-ink">
      {/* franja de datos */}
      <div className="flex items-center justify-between px-6 pt-24 sm:px-10">
        <MaskedLine delay={0.15} onMount>
          <span className="micro whitespace-nowrap text-ink/45">
            Finca Pedregal<span className="hidden sm:inline"> · La Plata, Huila</span>
          </span>
        </MaskedLine>
        <MaskedLine delay={0.2} onMount>
          <span className="micro whitespace-nowrap text-ink/45">1.900 m s. n. m.</span>
        </MaskedLine>
      </div>

      {/* logotipo tipográfico a sangre */}
      <div className="flex flex-1 items-center px-6 sm:px-10">
        <h1 className="flex w-full items-baseline justify-between text-[clamp(2.8rem,13.5vw,13rem)] leading-none">
          <MaskedLine delay={0.25} duration={1.15} onMount>
            <span className="display">Café</span>
          </MaskedLine>
          <MaskedLine delay={0.36} duration={1.15} onMount>
            <span className="display-serif text-rust">Laurel</span>
          </MaskedLine>
        </h1>
      </div>

      {/* banda inferior: declaración a la izquierda, producto a la derecha */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.9, ease: EASE_OUT_EXPO }}
        className="grid grid-cols-1 gap-10 border-t border-ink/12 px-6 py-10 sm:px-10 lg:grid-cols-12 lg:gap-8"
      >
        <div className="lg:col-span-5">
          <p className="max-w-sm text-lg leading-snug text-ink/75">
            El café que antes viajaba lejos porque afuera pagaban más.
            Ahora se queda, y corona a quien lo hace posible.
          </p>

          <button
            onClick={() => goTo("nuestro-cafe")}
            className="group mt-7 inline-flex items-center gap-3 rounded-full bg-ink py-3.5 pl-6 pr-3.5 text-cream transition-colors hover:bg-rust"
          >
            <span className="micro">Conoce el café</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink transition-transform group-hover:translate-x-0.5">
              ↓
            </span>
          </button>
        </div>

        {/* índice de secciones — navegación, no decoración */}
        <nav className="lg:col-span-4 lg:col-start-6">
          {SECTIONS.map((s, i) => (
            <motion.button
              key={s.id}
              onClick={() => goTo(s.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 + i * 0.06, duration: 0.6, ease: EASE_OUT_EXPO }}
              className="group flex w-full items-baseline gap-3 border-b border-ink/10 py-2.5 text-left last:border-b-0"
            >
              <span className="w-6 font-sans text-[0.65rem] text-rust">{s.n}</span>
              <span className="text-base font-medium text-ink/80 transition-colors group-hover:text-rust">
                {s.label}
              </span>
              <span className="ml-auto text-ink/25 transition-transform group-hover:translate-x-1">
                →
              </span>
            </motion.button>
          ))}
        </nav>

        <div className="hidden lg:col-span-3 lg:block">
          <Parallax distance={26}>
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src="/images/producto-bolsa-cafe-fondo-claro.jpg"
                alt="Bolsa de Café Laurel, Huila — Finca Pedregal"
                fill
                priority
                sizes="(max-width: 1024px) 0vw, 25vw"
                className="object-cover"
              />
            </div>
          </Parallax>
        </div>
      </motion.div>
    </section>
  );
}
