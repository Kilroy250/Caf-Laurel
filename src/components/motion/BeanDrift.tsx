"use client";

import { useRef } from "react";
import Image from "next/image";
import { type MotionValue, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export type GranoConfig = {
  left: string;
  top: string;
  size: number;
  depth: number;
  rot: number[];
  blur: number;
  desktop?: boolean;
  /** para los granos que pasan detrás de texto: más tenues, no compiten con la lectura */
  opacity?: number;
};

// Cada grano es una capa de profundidad: más cerca = más grande, más rápido y más nítido.
// `desktop`: solo en pantallas medianas o más; en móvil quedarían sobre el texto.
export const GRANOS_ORIGEN: GranoConfig[] = [
  { left: "74%", top: "3%", size: 120, depth: 1.25, rot: [-25, 120], blur: 0 },
  { left: "89%", top: "12%", size: 62, depth: 0.6, rot: [35, -110], blur: 1.5, desktop: true },
  { left: "84%", top: "19%", size: 38, depth: 0.35, rot: [0, 190], blur: 2.5, desktop: true },
  { left: "93%", top: "27%", size: 150, depth: 1.5, rot: [70, -40], blur: 0, desktop: true },
  { left: "80%", top: "37%", size: 50, depth: 0.5, rot: [-80, 70], blur: 2, desktop: true },
  { left: "69%", top: "45%", size: 84, depth: 0.9, rot: [15, 160], blur: 0.5, desktop: true },
  { left: "96%", top: "52%", size: 34, depth: 0.3, rot: [0, -170], blur: 3, desktop: true },
];

/**
 * Granos suspendidos que flotan y giran con el scroll. Va dentro de un contenedor `relative`.
 * `stage`: cada vez que sube, los granos bajan un tramo (`stageStep`, en vh) — los más
 * cercanos bajan más — como si cayeran hacia el siguiente paso.
 */
export function BeanDrift({
  className,
  granos = GRANOS_ORIGEN,
  stage = 0,
  stageStep = 0,
  idle = false,
  stageByDepth = true,
}: {
  className?: string;
  granos?: GranoConfig[];
  stage?: number;
  stageStep?: number;
  /** flote suave continuo, para escenas sin scroll */
  idle?: boolean;
  /** false: todos bajan lo mismo en cada paso (se mantienen las distancias, nunca se cruzan) */
  stageByDepth?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {granos.map((g, i) => (
        <Grano key={i} index={i} {...g} progress={scrollYProgress} stage={stage} stageStep={stageStep} idle={idle} stageByDepth={stageByDepth} />
      ))}
    </div>
  );
}

function Grano({
  left,
  top,
  size,
  depth,
  rot,
  blur,
  desktop,
  opacity,
  progress,
  stage,
  stageStep,
  idle,
  index,
  stageByDepth,
}: GranoConfig & {
  progress: MotionValue<number>;
  stage: number;
  stageStep: number;
  idle: boolean;
  index: number;
  stageByDepth: boolean;
}) {
  const reduce = useReducedMotion();
  const y = useTransform(progress, [0, 1], [`${-depth * 30}vh`, `${depth * 30}vh`]);
  const rotate = useTransform(progress, [0, 1], rot);

  return (
    <motion.div
      style={{
        left,
        top,
        width: `clamp(${Math.round(size * 0.55)}px, ${(size / 14.4).toFixed(2)}vw, ${size}px)`,
        filter: blur ? `blur(${blur}px)` : undefined,
        opacity,
        ...(reduce ? { rotate: rot[0] } : { y, rotate }),
      }}
      className={`absolute -translate-x-1/2 ${desktop ? "hidden md:block" : ""}`}
    >
      {/* capa interna: el salto de paso, con resorte, sin pelear con el scroll */}
      <motion.div
        animate={
          reduce
            ? undefined
            : stageByDepth
              ? { y: `${stage * stageStep * depth}vh`, rotate: stage * 28 * (rot[1] > rot[0] ? 1 : -1) }
              : // caída paralela: misma distancia y sin giro, así nunca se tocan
                { y: `${stage * stageStep}vh` }
        }
        transition={{ type: "spring", stiffness: 60, damping: 14, mass: 0.9 }}
      >
        {/* flote: cada grano con su propio ritmo, los lejanos más lentos */}
        <motion.div
          animate={idle && !reduce ? { y: [0, -14 * depth, 0], rotate: [0, 6 * (index % 2 ? 1 : -1), 0] } : undefined}
          transition={{ duration: 5 + (index % 4) * 1.3 + (1 - depth) * 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
        >
          <Image
            src="/images/grano-recorte.webp"
            alt=""
            width={420}
            height={662}
            sizes="180px"
            className="h-auto w-full drop-shadow-[0_18px_22px_rgba(18,16,9,0.22)]"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
