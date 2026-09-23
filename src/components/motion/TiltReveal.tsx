"use client";

import { type ReactNode, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Tarjeta en perspectiva 3D que se endereza con el scroll.
 * (Basado en el patrón "container scroll" de 21st.dev.)
 */
export function TiltReveal({
  children,
  header,
  className,
}: {
  children: ReactNode;
  header?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [26, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const lift = useTransform(scrollYProgress, [0, 1], [70, 0]);

  return (
    <div ref={ref} className={className} style={{ perspective: "1200px" }}>
      {header && (
        <motion.div style={reduce ? undefined : { y: lift }}>{header}</motion.div>
      )}
      <motion.div
        style={reduce ? undefined : { rotateX, scale, transformOrigin: "center top" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
