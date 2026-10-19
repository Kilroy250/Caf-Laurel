"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ScrollSequence } from "@/components/motion/ScrollSequence";
import { useProgresoSuave, useScrollLinked } from "@/components/motion/Primitives";
import { useMediaQuery } from "@/components/useMediaQuery";

/**
 * Cierre del proceso: la escena queda fija y el café se sirve a medida que
 * se hace scroll. Después de cinco etapas en la finca, la taza.
 */
export function CierreTaza() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // pantalla vertical (celular): el video horizontal se ajusta al ancho en vez de recortarse
  const vertical = useMediaQuery("(max-aspect-ratio: 1/1)");
  const compacta = useMediaQuery("(max-width: 63.98rem)");
  const { scrollYProgress: crudo } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scrollYProgress = useProgresoSuave(crudo);
  // el vertido ocupa casi todo el tramo; el título llega al final
  const pour = useTransform(scrollYProgress, [0.05, 0.85], [0, 1]);
  const titleOpacity = useScrollLinked(scrollYProgress, [0.55, 0.8], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.55, 0.8], [30, 0]);

  return (
    <div ref={ref} data-escena className={reduce ? "relative bg-black pin:snap-start" : "relative h-[220vh] bg-black pin:snap-start"}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <ScrollSequence
          folder="/secuencias/taza-porcelana"
          count={72}
          progress={pour}
          stillFrame={60}
          label="Taza de porcelana con borde dorado sirviéndose de café negro"
          fit={vertical ? "width" : "cover"}
          zoom={1.25}
          paso={compacta ? 2 : 1}
          className="absolute inset-0 h-full w-full"
        />

        {/* el negro del video se funde con el tono de la sección */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink/70" />

        <motion.div
          style={reduce ? undefined : { opacity: titleOpacity, y: titleY }}
          className="absolute inset-x-0 bottom-0 px-6 pb-[calc(4rem+env(safe-area-inset-bottom))] sm:px-10 md:pb-20 lg:text-right"
        >
          <h2 className="text-[clamp(2.4rem,6vw,5rem)] leading-[0.95] text-cream">
            <span className="display block">Hasta llegar</span>
            <span className="display-script block text-rust">a tu taza.</span>
          </h2>
        </motion.div>
      </div>
    </div>
  );
}
