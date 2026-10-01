"use client";

import { type ReactNode, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useScrollLinked } from "./Primitives";

/**
 * La imagen arranca como una columna angosta y se abre a pantalla completa
 * mientras el bloque pasa por el viewport; el título se separa hacia los lados.
 * Con la foto ya abierta, la escena sigue fija y aparece `children`: el
 * cuadro final, sobre la misma foto. Ligado al scroll real — sin capturar la rueda.
 */
export function ScrollExpandImage({
  src,
  alt,
  leftWord,
  rightWord,
  caption,
  children,
}: {
  src: string;
  alt: string;
  leftWord: string;
  rightWord: string;
  caption?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // tramos: 0–0.55 la foto se abre · 0.62–0.8 llega el cuadro final · 0.8–1 se sostiene
  const width = useTransform(scrollYProgress, [0, 0.55], ["34vw", "100vw"]);
  const height = useTransform(scrollYProgress, [0, 0.55], ["58vh", "100vh"]);
  const radius = useTransform(scrollYProgress, [0, 0.55], [4, 0]);
  // la foto se aclara al abrirse y vuelve a oscurecerse para que el texto final se lea
  const shade = useScrollLinked(scrollYProgress, [0, 0.45, 0.62, 0.8], [0.55, 0.12, 0.12, 0.5]);
  const spreadLeft = useTransform(scrollYProgress, [0, 0.55], ["0vw", "-21vw"]);
  const spreadRight = useTransform(scrollYProgress, [0, 0.55], ["0vw", "21vw"]);
  const titleOpacity = useScrollLinked(scrollYProgress, [0.3, 0.52], [1, 0]);
  const captionOpacity = useScrollLinked(scrollYProgress, [0, 0.15], [1, 0]);
  const endOpacity = useScrollLinked(scrollYProgress, [0.62, 0.8], [0, 1]);
  const endY = useTransform(scrollYProgress, [0.62, 0.8], [36, 0]);

  return (
    <div ref={ref} className={reduce ? "relative" : "relative h-[340vh]"}>
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-ink">
        <motion.div
          style={
            reduce
              ? { width: "100vw", height: "100svh" }
              : { width, height, borderRadius: radius }
          }
          className="relative overflow-hidden"
        >
          <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
          <motion.div
            className="absolute inset-0 bg-ink"
            style={reduce ? { opacity: 0.5 } : { opacity: shade }}
          />
        </motion.div>

        {!reduce && (
          <motion.div
            style={{ opacity: titleOpacity }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          >
            <div className="flex w-full items-center justify-center gap-[0.25em] px-6 text-[clamp(2rem,6vw,5.5rem)]">
              <motion.span style={{ x: spreadLeft }} className="display whitespace-nowrap text-cream">
                {leftWord}
              </motion.span>
              <motion.span style={{ x: spreadRight }} className="display whitespace-nowrap text-cream">
                {rightWord}
              </motion.span>
            </div>

            {caption && (
              <motion.p style={{ opacity: captionOpacity }} className="micro mt-6 text-cream/60">
                {caption}
              </motion.p>
            )}
          </motion.div>
        )}

        {children && (
          <motion.div
            style={reduce ? undefined : { opacity: endOpacity, y: endY }}
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent px-6 pb-12 pt-32 sm:px-10 md:pb-16"
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
}
