"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-[100svh] items-center justify-center overflow-hidden bg-ink"
    >
      <Image
        src="/images/cafetales-ladera-huila.jpg"
        alt="Cafetales en la ladera de la montaña, Huila"
        fill
        priority
        className="object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-5 px-6 text-center text-cream"
      >
        <Image
          src="/images/logo-cafe-laurel-blanco.png"
          alt="Café Laurel"
          width={760}
          height={307}
          className="w-64 sm:w-80"
        />
        <p className="font-serif-italic text-xl text-gold sm:text-2xl">
          La grandeza se cultiva
        </p>
      </motion.div>

      <motion.button
        onClick={() =>
          document.getElementById("por-que-existimos")?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-cream/70"
      >
        Desliza para descubrir
        <motion.span
          className="h-8 w-px bg-cream/40"
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.button>
    </section>
  );
}
