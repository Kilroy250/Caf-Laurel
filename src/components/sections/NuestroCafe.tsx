"use client";

import { type ReactNode, useRef } from "react";
import Image from "next/image";
import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  EASE_OUT_EXPO,
  MaskedLine,
  Reveal,
  Stagger,
  StaggerItem,
  useScrollLinked,
} from "@/components/motion/Primitives";
import { SectionHead } from "@/components/SectionHead";
import { ArrowIcon } from "@/components/Icons";
import { PIN_QUERY, useMediaQuery } from "@/components/useMediaQuery";
import { abrirPedido } from "@/components/Pedido";

const SPECS = [
  { label: "Altura", value: "1.900 m s. n. m." },
  { label: "Variedad", value: "Castilla · F6" },
  { label: "Proceso", value: "Lavado · secado al sol" },
  { label: "Origen", value: "Finca Pedregal, La Plata, Huila" },
  { label: "Notas", value: "Caramelo, vainilla, melón dulce" },
];

export function NuestroCafe() {
  const reduce = useReducedMotion();
  const wide = useMediaQuery(PIN_QUERY);
  // la escena fija solo existe en pantallas grandes y con movimiento permitido
  const pinned = wide && !reduce;

  const sceneRef = useRef<HTMLDivElement>(null);

  // entrada: desde que la sección asoma hasta que toca el borde superior
  const { scrollYProgress: entry } = useScroll({
    target: sceneRef,
    offset: ["start end", "start start"],
  });
  // escena fija: mientras la sección está anclada
  const { scrollYProgress: scene } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  // la foto se abre desde un marco más estrecho y se asienta con un zoom lento
  const clip = useScrollLinked(entry, [0.15, 1], ["inset(14% 16% 14% 16%)", "inset(0% 0% 0% 0%)"]);
  const zoomIn = useTransform(entry, [0.15, 1], [1.22, 1.07]);
  const zoomHold = useTransform(scene, [0, 1], [1.07, 1]);
  const zoom = useTransform(() => (scene.get() > 0 ? zoomHold.get() : zoomIn.get()));
  const cta = useScrollLinked(scene, [0.56, 0.7], [0, 1]);
  const ctaY = useTransform(scene, [0.56, 0.7], [12, 0]);
  const ctaEvents = useTransform(cta, (v) => (v > 0.5 ? "auto" : "none"));

  const quieroUno = (
    <button
      onClick={() => abrirPedido()}
      className="group inline-flex items-center gap-3 rounded-full bg-rust py-3.5 pl-6 pr-3.5 text-cream transition-colors hover:bg-cream hover:text-ink"
    >
      <span className="micro">Quiero uno</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink transition-colors group-hover:bg-rust group-hover:text-cream">
        <ArrowIcon className="h-4 w-4" />
      </span>
    </button>
  );

  return (
    <section id="nuestro-cafe" className="bg-ink text-cream">
      {/* 240vh de alto = la escena queda fija durante 140vh de scroll */}
      <div ref={sceneRef} className="relative pin:h-[240vh] pin:snap-start">
        {/* segundo encuadre: la ficha completa y el botón ya visibles */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[105vh] hidden h-px pin:block pin:snap-start" />
        <div className="flex flex-col px-6 pb-20 pt-20 sm:px-10 md:pt-28 pin:sticky pin:top-0 pin:h-svh pin:pb-10 pin:pt-24">
          <SectionHead n="01" label="Nuestro café" tone="dark" />

          <div className="mt-12 grid min-h-0 flex-1 gap-14 pin:mt-6 pin:grid-cols-12 pin:items-center pin:gap-8">
            {/* título + tesis */}
            <div className="pin:col-span-4">
              <h2 className="text-[clamp(2.5rem,9vw,4rem)] leading-[0.9] pin:text-[clamp(2.4rem,3.6vw,4rem)]">
                <MaskedLine>
                  <span className="display">Antes se iba</span>
                </MaskedLine>
                <MaskedLine delay={0.08}>
                  <span className="display">lejos.</span>
                </MaskedLine>
                <MaskedLine delay={0.16}>
                  <span className="display-script text-rust">Ahora se queda en casa.</span>
                </MaskedLine>
              </h2>

              <Reveal delay={0.2}>
                <p className="mt-7 max-w-sm text-lg leading-relaxed text-cream/70 pin:text-base xl:text-lg">
                  Ese café solía viajar lejos, porque afuera pagan más. Laurel
                  existe para devolvértelo: un solo origen, una sola finca, un
                  solo lote.
                </p>
              </Reveal>
            </div>

            {/* producto */}
            <div className="pin:col-span-4 pin:flex pin:justify-center">
              {/* key: al pasar de móvil a escritorio (se sabe tras cargar) el marco se recrea con su propia animación */}
              <motion.div
                key={pinned ? "fija" : "flujo"}
                style={pinned ? { clipPath: clip } : undefined}
                initial={pinned ? false : { opacity: 0, y: 30 }}
                whileInView={pinned ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, ease: EASE_OUT_EXPO }}
                className="relative mx-auto aspect-[2/3] w-full max-w-md overflow-hidden bg-ink-soft pin:max-w-[min(46svh,27rem)]"
              >
                <motion.div style={pinned ? { scale: zoom } : undefined} className="absolute inset-0">
                  <Image
                    src="/images/producto-bolsa-cafe-fondo-oscuro.jpg"
                    alt="Bolsa de Café Laurel, Huila — Finca Pedregal, sobre una base de mármol negro"
                    fill
                    sizes="(max-width: 1024px) 90vw, 30vw"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* ficha: cada dato aparece con el scroll */}
            <div className="pin:col-span-4 pin:xl:col-span-3 pin:xl:col-start-10">
              <SpecList pinned={pinned} scene={scene} />

              <div className="mt-10 pin:mt-8">
                {pinned ? (
                  <motion.div style={{ opacity: cta, y: ctaY, pointerEvents: ctaEvents }}>
                    {quieroUno}
                  </motion.div>
                ) : (
                  <Reveal delay={0.1}>{quieroUno}</Reveal>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

/** Ficha técnica. Fija: cada dato llega en su tramo de scroll. Normal: escalonada al entrar. */
function SpecList({ pinned, scene }: { pinned: boolean; scene: MotionValue<number> }) {
  if (!pinned) {
    return (
      <Stagger delay={0.1}>
        {SPECS.map((s) => (
          <StaggerItem key={s.label} className="border-t border-cream/12 py-3.5">
            <SpecText label={s.label} value={s.value} />
          </StaggerItem>
        ))}
      </Stagger>
    );
  }

  return (
    <div>
      {SPECS.map((s, i) => (
        <PinnedSpec key={s.label} scene={scene} from={0.04 + i * 0.1}>
          <SpecText label={s.label} value={s.value} />
        </PinnedSpec>
      ))}
    </div>
  );
}

function PinnedSpec({
  scene,
  from,
  children,
}: {
  scene: MotionValue<number>;
  from: number;
  children: ReactNode;
}) {
  const range = [from, from + 0.16];
  const line = useTransform(scene, range, [0, 1]);
  const opacity = useScrollLinked(scene, [from + 0.04, from + 0.16], [0, 1]);
  const y = useTransform(scene, [from + 0.04, from + 0.16], [14, 0]);

  return (
    <div className="relative py-3 xl:py-3.5">
      <motion.span
        style={{ scaleX: line }}
        className="rule absolute left-0 top-0 origin-left bg-cream/15"
      />
      <motion.div style={{ opacity, y }}>{children}</motion.div>
    </div>
  );
}

function SpecText({ label, value }: { label: string; value: string }) {
  return (
    <>
      <p className="micro text-cream/40">{label}</p>
      <p className="mt-1.5 text-lg font-medium leading-snug">{value}</p>
    </>
  );
}
