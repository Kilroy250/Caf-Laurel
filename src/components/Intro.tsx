"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CosecheroIcon } from "./CosecheroIcon";
import { EASE_OUT_EXPO } from "./motion/Primitives";

const TAGLINE = ["La", "grandeza", "se", "cultiva"];

export function Intro() {
  const [stage, setStage] = useState<"tagline" | "marca">("tagline");
  const [gone, setGone] = useState(false);
  const reduce = useReducedMotion();

  const dismiss = useCallback(() => setGone(true), []);

  useEffect(() => {
    const t = setTimeout(() => setStage("marca"), reduce ? 600 : 2400);
    return () => clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (gone) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = "";
    };
  }, [gone]);

  useEffect(() => {
    if (stage !== "marca" || gone) return;
    const opts = { passive: true } as const;
    window.addEventListener("wheel", dismiss, opts);
    window.addEventListener("touchmove", dismiss, opts);
    window.addEventListener("keydown", dismiss);
    return () => {
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchmove", dismiss);
      window.removeEventListener("keydown", dismiss);
    };
  }, [stage, gone, dismiss]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-6 py-8 sm:px-10"
          exit={{ y: "-100%", transition: { duration: 1, ease: EASE_OUT_EXPO } }}
        >
          {/* franja superior */}
          <div className="flex items-start justify-between">
            <span className="micro text-cream/40">Finca Pedregal</span>
            <span className="micro text-cream/40">La Plata · Huila</span>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <AnimatePresence mode="wait">
              {stage === "tagline" ? (
                <motion.h1
                  key="tagline"
                  className="display-serif text-center text-[clamp(2.2rem,8vw,6rem)] text-cream"
                  exit={{
                    opacity: 0,
                    filter: "blur(6px)",
                    transition: { duration: 0.6, ease: "easeIn" },
                  }}
                >
                  {TAGLINE.map((w, i) => (
                    <span key={w} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                      <motion.span
                        className="inline-block"
                        initial={reduce ? { opacity: 0 } : { y: "110%" }}
                        animate={reduce ? { opacity: 1 } : { y: 0 }}
                        transition={{
                          duration: 1,
                          delay: 0.25 + i * 0.12,
                          ease: EASE_OUT_EXPO,
                        }}
                      >
                        {w}
                        {i < TAGLINE.length - 1 ? " " : ""}
                      </motion.span>
                    </span>
                  ))}
                </motion.h1>
              ) : (
                <motion.div
                  key="marca"
                  className="flex flex-col items-center gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7 }}
                >
                  <motion.div
                    initial={reduce ? {} : { clipPath: "inset(0 0 100% 0)" }}
                    animate={{ clipPath: "inset(0 0 0% 0)" }}
                    transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
                    className="w-[min(70vw,26rem)]"
                  >
                    <Image
                      src="/images/logo-cafe-laurel-blanco.png"
                      alt="Café Laurel"
                      width={760}
                      height={307}
                      priority
                      className="h-auto w-full"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.8, ease: EASE_OUT_EXPO }}
                    className="h-16 w-16 text-cream sm:h-20 sm:w-20"
                  >
                    <CosecheroIcon className="h-full w-full" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* pie: indicador de scroll, solo aquí */}
          <div className="flex h-16 items-end justify-center">
            <AnimatePresence>
              {stage === "marca" && (
                <motion.button
                  type="button"
                  onClick={dismiss}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="group flex flex-col items-center gap-3"
                >
                  <span className="micro text-cream/50 transition-colors group-hover:text-rust">
                    Desliza para descubrir
                  </span>
                  <span className="relative block h-10 w-px overflow-hidden bg-cream/15">
                    <motion.span
                      className="absolute inset-x-0 top-0 block h-1/2 bg-rust"
                      animate={{ y: ["-100%", "200%"] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
