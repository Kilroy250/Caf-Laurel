"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CosecheroIcon } from "./CosecheroIcon";
import { EASE_OUT_EXPO } from "./motion/Primitives";

export function Intro({ onEnter }: { onEnter: () => void }) {
  const [stage, setStage] = useState<"tagline" | "marca">("tagline");
  const [leaving, setLeaving] = useState(false);
  const reduce = useReducedMotion();

  // el logotipo y el aviso se retiran antes de que el campesino suba
  const enter = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onEnter, reduce ? 0 : 480);
  }, [leaving, onEnter, reduce]);

  useEffect(() => {
    const t = setTimeout(() => setStage("marca"), reduce ? 400 : 3600);
    return () => clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (stage !== "marca") return;
    const opts = { passive: true } as const;
    window.addEventListener("wheel", enter, opts);
    window.addEventListener("touchmove", enter, opts);
    window.addEventListener("keydown", enter);
    return () => {
      window.removeEventListener("wheel", enter);
      window.removeEventListener("touchmove", enter);
      window.removeEventListener("keydown", enter);
    };
  }, [stage, enter]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream text-ink">
      <AnimatePresence mode="wait">
        {stage === "tagline" && (
          <motion.p
            key="tagline"
            className="display-script px-8 text-center text-[clamp(2.6rem,9vw,7rem)] text-ink"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: "blur(10px)" }}
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, filter: "blur(0px)" }
            }
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.06, filter: "blur(8px)" }
            }
            transition={{ duration: 2.1, ease: EASE_OUT_EXPO }}
          >
            La grandeza se cultiva
          </motion.p>
        )}
      </AnimatePresence>

      {stage === "marca" && (
        <div className="flex flex-col items-center">
          {/* logotipo: se retira al entrar */}
          <motion.div
            className="w-[min(46vw,15rem)]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{
              opacity: leaving ? 0 : 1,
              y: 0,
              filter: leaving ? "blur(4px)" : "blur(0px)",
            }}
            transition={{ duration: leaving ? 0.45 : 1.1, ease: EASE_OUT_EXPO }}
          >
            <Image
              src="/images/logo-cafe-laurel-negro.png"
              alt="Café Laurel"
              width={760}
              height={307}
              priority
              className="h-auto w-full"
            />
          </motion.div>

          {/* el campesino viaja a la barra superior */}
          <motion.div
            layoutId="cosechero"
            className="mt-10 h-[min(34vw,13rem)] w-[min(34vw,13rem)] text-ink"
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
          >
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 1.1, ease: EASE_OUT_EXPO }}
              className="h-full w-full"
            >
              <CosecheroIcon className="h-full w-full" />
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* aviso de deslizar — solo existe aquí */}
      <AnimatePresence>
        {stage === "marca" && !leaving && (
          <motion.button
            type="button"
            onClick={enter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            transition={{ delay: 1.1, duration: 0.9 }}
            className="group absolute bottom-10 flex flex-col items-center gap-3"
          >
            <span className="micro text-ink/40 transition-colors group-hover:text-rust">
              Desliza para descubrir
            </span>
            <span className="relative block h-10 w-px overflow-hidden bg-ink/15">
              <motion.span
                className="absolute inset-x-0 top-0 block h-1/2 bg-rust"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
