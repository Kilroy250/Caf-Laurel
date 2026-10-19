"use client";

import { type ReactNode, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useProgresoSuave, useScrollLinked } from "./Primitives";
import { PIN_QUERY, useMediaQuery } from "@/components/useMediaQuery";

/**
 * La imagen arranca como una ventana y se abre a pantalla completa mientras el
 * bloque pasa por el viewport; el título se separa hacia los lados (en celular,
 * apilado). Con la foto ya abierta, la escena sigue fija y aparece `children`:
 * el cuadro final, sobre la misma foto. Ligado al scroll real — sin capturar la rueda.
 *
 * La ventana se abre solo con transform: el marco se escala y la foto adentro se
 * des-escala lo mismo, así la foto no se deforma y el navegador no recalcula el
 * diseño en cada cuadro (antes se animaban width/height).
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
  const ancho = useMediaQuery("(min-width: 48rem)");
  const escritorio = useMediaQuery(PIN_QUERY);
  const { scrollYProgress: crudo } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // computador: la escena es más larga y la animación termina al 79 %; el resto del
  // recorrido es una pausa con el cuadro final ya completo, para poder leerlo
  const crudoEscalado = useTransform(crudo, (v) => (escritorio ? Math.min(v / 0.79, 1) : v));
  const scrollYProgress = useProgresoSuave(crudoEscalado);

  // tamaño inicial de la ventana: columna angosta en escritorio, más ancha en celular
  const inicioX = ancho ? 0.34 : 0.72;
  const inicioY = ancho ? 0.58 : 0.5;

  // tramos: 0–0.55 la foto se abre · 0.62–0.8 llega el cuadro final · 0.8–1 se sostiene
  const sx = useTransform(scrollYProgress, [0, 0.55], [inicioX, 1]);
  const sy = useTransform(scrollYProgress, [0, 0.55], [inicioY, 1]);
  const inversoX = useTransform(sx, (v) => 1 / v);
  const inversoY = useTransform(sy, (v) => 1 / v);
  // la foto se aclara al abrirse y vuelve a oscurecerse para que el texto final se lea
  const shade = useScrollLinked(scrollYProgress, [0, 0.45, 0.62, 0.8], [0.55, 0.12, 0.12, 0.5]);
  const spreadLeft = useTransform(scrollYProgress, [0, 0.55], ["0vw", "-21vw"]);
  const spreadRight = useTransform(scrollYProgress, [0, 0.55], ["0vw", "21vw"]);
  const titleOpacity = useScrollLinked(scrollYProgress, [0.3, 0.52], [1, 0]);
  // la segunda línea del título baja un poco mientras las palabras de arriba se abren
  const captionY = useTransform(scrollYProgress, [0, 0.55], ["0vh", "6vh"]);
  const endOpacity = useScrollLinked(scrollYProgress, [0.62, 0.8], [0, 1]);
  const endY = useTransform(scrollYProgress, [0.62, 0.8], [36, 0]);

  return (
    <div ref={ref} data-escena className={reduce ? "relative bg-ink pin:snap-start" : "relative h-[340vh] bg-ink pin:h-[430vh] pin:snap-start"}>
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        <motion.div
          style={reduce ? undefined : { scaleX: sx, scaleY: sy }}
          className="absolute inset-0 overflow-hidden"
        >
          <motion.div style={reduce ? undefined : { scaleX: inversoX, scaleY: inversoY }} className="absolute inset-0">
            <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
            <motion.div
              className="absolute inset-0 bg-ink"
              style={reduce ? { opacity: 0.5 } : { opacity: shade }}
            />
          </motion.div>
        </motion.div>

        {!reduce && (
          <motion.div
            style={{ opacity: titleOpacity }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          >
            <div className="flex w-full flex-col items-center justify-center px-6 text-[clamp(2.4rem,11vw,3.5rem)] leading-[0.92] md:flex-row md:gap-[0.25em] md:text-[clamp(2rem,6vw,5.5rem)] md:leading-[0.86]">
              <motion.span style={ancho ? { x: spreadLeft } : undefined} className="display whitespace-nowrap text-cream">
                {leftWord}
              </motion.span>
              <motion.span style={ancho ? { x: spreadRight } : undefined} className="display whitespace-nowrap text-cream">
                {rightWord}
              </motion.span>
            </div>

            {caption && (
              <motion.p
                style={{ y: captionY }}
                className="display mt-[0.35em] text-[clamp(1.4rem,6.2vw,2rem)] font-normal tracking-[-0.02em] text-rust md:text-[clamp(1.5rem,3.4vw,3.1rem)]"
              >
                {caption}
              </motion.p>
            )}
          </motion.div>
        )}

        {children && (
          <motion.div
            style={reduce ? undefined : { opacity: endOpacity, y: endY }}
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent px-6 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-32 sm:px-10 md:pb-16"
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
}
