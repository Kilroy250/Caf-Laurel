"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "./motion/Primitives";

/** Encabezado de sección: número, línea que se dibuja, y etiqueta. */
export function SectionHead({
  n,
  label,
  tone = "dark",
}: {
  n: string;
  label: string;
  tone?: "dark" | "light";
}) {
  const reduce = useReducedMotion();
  const dim = tone === "dark" ? "text-cream/40" : "text-ink/40";
  const line = tone === "dark" ? "bg-cream/25" : "bg-ink/20";

  return (
    <div className="flex items-center gap-5">
      <span className={`font-sans text-xs font-semibold text-rust`}>{n}</span>
      <motion.span
        className={`rule flex-1 origin-left ${line}`}
        initial={reduce ? { opacity: 0 } : { scaleX: 0 }}
        whileInView={reduce ? { opacity: 1 } : { scaleX: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
      />
      <span className={`micro ${dim}`}>{label}</span>
    </div>
  );
}
