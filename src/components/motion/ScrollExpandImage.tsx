"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * La imagen arranca como una columna angosta y se abre a pantalla completa
 * mientras el bloque pasa por el viewport; el título se separa hacia los lados.
 * Ligado al progreso de scroll real — sin capturar la rueda del mouse.
 */
export function ScrollExpandImage({
  src,
  alt,
  leftWord,
  rightWord,
  caption,
}: {
  src: string;
  alt: string;
  leftWord: string;
  rightWord: string;
  caption?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const width = useTransform(scrollYProgress, [0, 0.85], ["34vw", "100vw"]);
  const height = useTransform(scrollYProgress, [0, 0.85], ["58vh", "100vh"]);
  const radius = useTransform(scrollYProgress, [0, 0.85], [4, 0]);
  const shade = useTransform(scrollYProgress, [0, 0.7], [0.55, 0.15]);
  const spreadLeft = useTransform(scrollYProgress, [0, 0.85], ["0vw", "-21vw"]);
  const spreadRight = useTransform(scrollYProgress, [0, 0.85], ["0vw", "21vw"]);
  // el título cede el paso a la foto una vez abierta
  const titleOpacity = useTransform(scrollYProgress, [0.45, 0.8], [1, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  return (
    <div ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-ink">
        <motion.div
          style={
            reduce
              ? { width: "100vw", height: "100vh" }
              : { width, height, borderRadius: radius }
          }
          className="relative overflow-hidden"
        >
          <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
          <motion.div
            className="absolute inset-0 bg-ink"
            style={reduce ? { opacity: 0.2 } : { opacity: shade }}
          />
        </motion.div>

        <motion.div
          style={reduce ? undefined : { opacity: titleOpacity }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        >
          <div className="flex w-full items-center justify-center px-6">
            <motion.span
              style={reduce ? undefined : { x: spreadLeft }}
              className="display whitespace-nowrap text-[clamp(2rem,6vw,5.5rem)] text-cream"
            >
              {leftWord}
            </motion.span>
            <motion.span
              style={reduce ? undefined : { x: spreadRight }}
              className="display-script ml-[0.2em] whitespace-nowrap text-[clamp(2rem,6vw,5.5rem)] text-cream"
            >
              {rightWord}
            </motion.span>
          </div>

          {caption && (
            <motion.p
              style={reduce ? undefined : { opacity: captionOpacity }}
              className="micro mt-6 text-cream/60"
            >
              {caption}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
