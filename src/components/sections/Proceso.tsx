"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { MaskedLine, Reveal, useProgresoSuave } from "@/components/motion/Primitives";
import { ScrollSequence } from "@/components/motion/ScrollSequence";
import { useMediaQuery } from "@/components/useMediaQuery";
import { CierreTaza } from "@/components/sections/CierreTaza";
import { SectionHead } from "@/components/SectionHead";

const PASOS = [
  {
    n: "01",
    titulo: "Cosecha selectiva",
    clave: "Solo cerezas maduras",
    texto:
      "Se recolectan a mano únicamente las cerezas de rojo intenso: el punto ideal de azúcares naturales y una base limpia desde el origen.",
  },
  {
    n: "02",
    titulo: "Despulpado",
    clave: "El grano se libera",
    texto:
      "Se retira la cáscara de la cereza para evitar fermentaciones no deseadas y preparar el grano para la siguiente etapa.",
  },
  {
    n: "03",
    titulo: "Fermentación",
    clave: "De 12 a 24 horas",
    texto:
      "En tanques, según la temperatura y el clima, el grano desarrolla su carácter: su acidez brillante y su complejidad aromática.",
  },
  {
    n: "04",
    titulo: "Lavado",
    clave: "Una taza transparente",
    texto:
      "Con agua limpia se eliminan todos los residuos hasta obtener un pergamino limpio, que garantiza una taza definida y sin notas indeseadas.",
  },
  {
    n: "05",
    titulo: "Secado al sol",
    clave: "Lento y uniforme",
    texto:
      "En paseras, con ventilación natural, hasta alcanzar una humedad del 10–12 %. Este secado estabiliza el grano y conserva su calidad.",
  },
];

export function Proceso() {
  const pasosRef = useRef<HTMLOListElement>(null);
  const cuadroRef = useRef<HTMLDivElement>(null);
  const wide = useMediaQuery("(min-width: 64rem)");
  // escritorio: la tostadora (fija a la izquierda) avanza mientras se leen las cinco etapas
  const { scrollYProgress: pasosCrudo } = useScroll({ target: pasosRef, offset: ["start 0.6", "end 0.6"] });
  const pasos = useProgresoSuave(pasosCrudo);
  // móvil: la columna no es fija, avanza mientras el cuadro cruza la pantalla
  const { scrollYProgress: cuadro } = useScroll({ target: cuadroRef, offset: ["start end", "end start"] });

  return (
    <section id="proceso" className="bg-ink text-cream pin:snap-start">
      <div className="px-6 pb-24 pt-20 sm:px-10 md:pb-32 md:pt-28">
        <SectionHead n="04" label="Del árbol a tu taza" tone="dark" />

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* columna fija */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.92]">
                <MaskedLine>
                  <span className="display">Un proceso</span>
                </MaskedLine>
                <MaskedLine delay={0.08}>
                  <span className="display-script text-rust">sin atajos.</span>
                </MaskedLine>
              </h2>

              <Reveal delay={0.15}>
                <p className="mt-6 max-w-xs text-lg leading-relaxed text-cream/70">
                  Cinco etapas. Así se hace nuestro Café Laurel.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div ref={cuadroRef} className="relative mt-10 aspect-[4/5] w-full max-w-sm overflow-hidden bg-ink-soft lg:max-w-[min(24rem,calc((100svh-21rem)*0.8))]">
                  <ScrollSequence
                    folder="/secuencias/tostadora"
                    count={60}
                    paso={wide ? 1 : 2}
                    progress={wide ? pasos : cuadro}
                    stillFrame={20}
                    label="Granos de café girando en la bandeja de una tostadora"
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </Reveal>
            </div>
          </div>

          {/* etapas */}
          <ol ref={pasosRef} className="lg:col-span-7 lg:col-start-6">
            {PASOS.map((p, i) => (
              // computador: cada etapa ocupa media pantalla, así se lee una a la vez mientras la tostadora avanza
              <li
                key={p.n}
                className="border-t border-cream/12 py-10 first:border-t-0 first:pt-0 lg:flex lg:min-h-[58svh] lg:flex-col lg:justify-center lg:first:pt-10"
              >
                <Reveal delay={0.05}>
                  <div className="flex items-baseline gap-5">
                    <span className="display text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-rust">
                      {p.n}
                    </span>
                    <div>
                      <p className="micro text-cream/40">{p.clave}</p>
                      <h3 className="mt-2 text-[clamp(1.5rem,3.2vw,2.5rem)] font-bold leading-tight">
                        {p.titulo}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-5 max-w-lg text-lg leading-relaxed text-cream/70 lg:pl-[calc(clamp(2.5rem,6vw,4.5rem)+1.25rem)]">
                    {p.texto}
                  </p>
                </Reveal>
                {i === PASOS.length - 1 && <span className="sr-only">Fin del proceso</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <CierreTaza />
    </section>
  );
}
