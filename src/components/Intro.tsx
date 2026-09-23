"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { CosecheroIcon } from "./CosecheroIcon";

const TAGLINE = "La grandeza se cultiva";

export function Intro() {
  const [stage, setStage] = useState<"tagline" | "logo" | "done">("tagline");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage("logo"), 2200);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (dismissed) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [dismissed]);

  useEffect(() => {
    if (stage !== "logo") return;
    const onScroll = () => setDismissed(true);
    const onWheel = () => setDismissed(true);
    const onTouch = () => setDismissed(true);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("keydown", onScroll);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("keydown", onScroll);
    };
  }, [stage]);

  const letters = TAGLINE.split("");

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink text-cream"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
        >
          <AnimatePresence mode="wait">
            {stage === "tagline" && (
              <motion.h1
                key="tagline"
                className="px-8 text-center font-serif-italic text-3xl sm:text-4xl md:text-5xl"
                exit={{ opacity: 0, y: -16, transition: { duration: 0.5 } }}
              >
                {letters.map((ch, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.035, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ch === " " ? " " : ch}
                  </motion.span>
                ))}
              </motion.h1>
            )}

            {stage === "logo" && (
              <motion.div
                key="logo"
                className="flex flex-col items-center gap-6 px-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="w-56 sm:w-72"
                >
                  <Image
                    src="/images/logo-cafe-laurel-blanco.png"
                    alt="Café Laurel"
                    width={760}
                    height={307}
                    priority
                    className="w-full h-auto"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="h-16 w-16 sm:h-20 sm:w-20"
                >
                  <CosecheroIcon className="h-full w-full" />
                </motion.div>

                <motion.button
                  type="button"
                  onClick={() => setDismissed(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="mt-4 flex flex-col items-center gap-2 text-xs tracking-[0.2em] text-cream/70 uppercase"
                >
                  Desliza para descubrir
                  <motion.span
                    className="h-8 w-px bg-cream/40"
                    animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
