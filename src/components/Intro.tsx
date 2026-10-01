"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  type MotionValue,
  type Variants,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { CosecheroIcon } from "./CosecheroIcon";
import { INTRO_DONE, INTRO_RANGE, useIntro } from "./intro-context";

const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
/** Tramo del progreso global que le corresponde a un elemento, reescalado a 0 → 1. */
const span = (p: number, from: number, to: number) => clamp01((p - from) / (to - from));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const out = (t: number) => Math.sin((t * Math.PI) / 2);

type Flight = { dx: number; dy: number; s: number };

/** Distancia entre centros y escala entre un elemento y su lugar de destino. */
function flightBetween(from: Element | null, to: Element | null): Flight | null {
  if (!from || !to) return null;
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  if (!a.width || !b.width) return null;
  return {
    dx: b.left + b.width / 2 - (a.left + a.width / 2),
    dy: b.top + b.height / 2 - (a.top + a.height / 2),
    s: b.width / a.width,
  };
}

/** Normaliza la rueda: Firefox a veces reporta líneas o páginas en vez de píxeles. */
function wheelPixels(e: WheelEvent) {
  if (e.deltaMode === 1) return e.deltaY * 33;
  if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
  return e.deltaY;
}

export function Intro({
  virtual,
  onArrive,
  onRelease,
}: {
  virtual: MotionValue<number>;
  onArrive: () => void;
  onRelease: () => void;
}) {
  const { phase, progress, heroLogoRef, navMarkRef } = useIntro();
  const reduce = useReducedMotion();

  const [fontsReady, setFontsReady] = useState(false);
  const [stage, setStage] = useState<"frase" | "marca">("frase");
  // el gesto solo conduce la transición cuando los logos terminaron de
  // aparecer; antes, un scroll impaciente se los saltaría por completo
  const [interactive, setInteractive] = useState(false);

  const interactiveRef = useRef(interactive);
  const phaseRef = useRef(phase);
  useEffect(() => {
    interactiveRef.current = interactive;
  }, [interactive]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // ── geometría del vuelo: se mide del lugar de salida al lugar de llegada ──
  const logoStart = useRef<HTMLDivElement>(null);
  const markStart = useRef<HTMLDivElement>(null);

  const logoDx = useMotionValue(0);
  const logoDy = useMotionValue(0);
  const logoS = useMotionValue(1);
  const markDx = useMotionValue(0);
  const markDy = useMotionValue(0);
  const markS = useMotionValue(1);

  const measure = useCallback(() => {
    const logo = flightBetween(logoStart.current, heroLogoRef.current);
    const mark = flightBetween(markStart.current, navMarkRef.current);
    if (logo) {
      logoDx.set(logo.dx);
      logoDy.set(logo.dy);
      logoS.set(logo.s);
    }
    if (mark) {
      markDx.set(mark.dx);
      markDy.set(mark.dy);
      markS.set(mark.s);
    }
  }, [heroLogoRef, navMarkRef, logoDx, logoDy, logoS, markDx, markDy, markS]);

  // el logotipo viaja a la izquierda en la primera parte del recorrido
  const logoT = useTransform(progress, (p) => inOut(span(p, 0, 0.75)));
  const logoX = useTransform([logoT, logoDx], ([t, d]: number[]) => t * d);
  const logoY = useTransform([logoT, logoDy], ([t, d]: number[]) => t * d);
  const logoScale = useTransform([logoT, logoS], ([t, s]: number[]) => lerp(1, s, t));

  // el campesino arranca un poco después: crece, y luego se achica mientras sube
  const markT = useTransform(progress, (p) => span(p, 0.08, INTRO_DONE));
  const markX = useTransform([markT, markDx], ([t, d]: number[]) => inOut(t) * d);
  const markY = useTransform([markT, markDy], ([t, d]: number[]) => inOut(t) * d);
  const markScale = useTransform([markT, markS], ([t, s]: number[]) =>
    t < 0.28 ? lerp(1, 1.12, out(t / 0.28)) : lerp(1.12, s, inOut((t - 0.28) / 0.72)),
  );

  const curtain = useTransform(progress, [0, 0.2], [1, 0]);
  const cue = useTransform(progress, [0, 0.06], [1, 0]);

  // ── 1. esperar la tipografía: si cambia a mitad del fundido, la frase salta ──
  useEffect(() => {
    let settled = false;
    const ready = () => {
      if (settled) return;
      settled = true;
      setFontsReady(true);
    };
    const fallback = setTimeout(ready, 1200);
    document.fonts?.ready.then(ready);
    return () => clearTimeout(fallback);
  }, []);

  // ── 2. la frase da paso a la marca ──
  useEffect(() => {
    if (!fontsReady) return;
    const t = setTimeout(() => setStage("marca"), reduce ? 900 : 3200);
    return () => clearTimeout(t);
  }, [fontsReady, reduce]);

  // ── bloqueo del scroll real mientras dura la intro ──
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "instant" });
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ── 3. el gesto del usuario conduce la transición ──
  const releaseTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const releaseDeadline = useRef<ReturnType<typeof setTimeout>>(undefined);

  // tras el relevo, la inercia del trackpad seguiría desplazando la página:
  // se absorbe hasta que el gesto se calma. El tope evita que un scroll
  // continuo mantenga la página bloqueada indefinidamente.
  const settle = useCallback(() => {
    clearTimeout(releaseTimer.current);
    releaseTimer.current = setTimeout(onRelease, 250);
    releaseDeadline.current ??= setTimeout(onRelease, 800);
  }, [onRelease]);

  const push = useCallback(
    (delta: number) => {
      if (!interactiveRef.current || phaseRef.current !== "intro") return;
      measure();
      const next = Math.min(Math.max(virtual.get() + delta, 0), INTRO_RANGE);
      if (reduce && next > 0) {
        virtual.set(INTRO_RANGE);
        progress.jump(1);
        return;
      }
      virtual.set(next);
    },
    [measure, virtual, progress, reduce],
  );

  const advance = useCallback(() => {
    if (!interactiveRef.current || phaseRef.current !== "intro") return;
    measure();
    virtual.set(INTRO_RANGE);
    if (reduce) progress.jump(1);
  }, [measure, virtual, progress, reduce]);

  useEffect(() => {
    let lastY = 0;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pellizco de zoom
      e.preventDefault();
      if (phaseRef.current === "arrived") return settle();
      push(wheelPixels(e));
    };
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const y = e.touches[0].clientY;
      if (phaseRef.current === "arrived") return settle();
      push((lastY - y) * 1.6);
      lastY = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if (!["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) return;
      e.preventDefault();
      advance();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [push, advance, settle]);

  useEffect(() => {
    if (interactive) measure();
  }, [interactive, measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // ── 4. llegada: todo ya está en su lugar; los elementos reales toman el relevo ──
  // (esperar a que el resorte llegue exacto al 1 añadía más de un segundo de cola invisible)
  useEffect(
    () =>
      progress.on("change", (v) => {
        if (v < INTRO_DONE + 0.01 || virtual.get() < INTRO_RANGE * (INTRO_DONE + 0.01)) return;
        if (phaseRef.current !== "intro") return;
        phaseRef.current = "arrived";
        progress.jump(1);
        onArrive();
      }),
    [progress, virtual, onArrive],
  );

  useEffect(() => {
    if (phase === "arrived") settle();
  }, [phase, settle]);

  useEffect(
    () => () => {
      clearTimeout(releaseTimer.current);
      clearTimeout(releaseDeadline.current);
    },
    [],
  );

  // ── entrada de los logos: se materializan y se enfocan mientras suben ──
  const logoEntrance: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 1, ease: EASE_SOFT } },
      }
    : {
        hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 1, ease: EASE_SOFT },
        },
      };

  const handedOff = phase !== "intro";

  return (
    <div className={`fixed inset-0 z-[100] ${handedOff ? "pointer-events-none" : ""}`}>
      <motion.div aria-hidden className="absolute inset-0 bg-cream" style={{ opacity: curtain }} />

      {/* cada etapa en su propia capa: una no puede desplazar a la otra */}
      <AnimatePresence mode="wait">
        {fontsReady && stage === "frase" && (
          <motion.div
            key="frase"
            className="absolute inset-0 flex items-center justify-center px-8"
          >
            <motion.p
              className="display-script text-center text-[clamp(2.6rem,9vw,7rem)] text-ink will-change-[opacity,transform,filter]"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, filter: "blur(10px)" }}
              animate={
                reduce
                  ? { opacity: 1, transition: { duration: 0.8 } }
                  : {
                      opacity: 1,
                      scale: 1,
                      filter: "blur(0px)",
                      transition: { duration: 1.6, ease: EASE_SOFT },
                    }
              }
              exit={
                reduce
                  ? { opacity: 0, transition: { duration: 0.5 } }
                  : {
                      opacity: 0,
                      scale: 1.04,
                      filter: "blur(8px)",
                      transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
                    }
              }
            >
              La grandeza se cultiva
            </motion.p>
          </motion.div>
        )}

        {stage === "marca" && (
          <motion.div
            key="marca"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.3 } } }}
          >
            {/* espacio reservado: el tamaño no cambia mientras aparece */}
            <div ref={logoStart} className="aspect-[760/307] w-[min(46vw,15rem)]">
              <motion.div
                className="h-full w-full"
                style={{ x: logoX, y: logoY, scale: logoScale, opacity: handedOff ? 0 : 1 }}
              >
                <motion.div variants={logoEntrance} className="h-full w-full">
                  <Image
                    src="/images/logo-cafe-laurel-negro.png"
                    alt="Café Laurel"
                    width={760}
                    height={307}
                    priority
                    className="h-full w-full"
                  />
                </motion.div>
              </motion.div>
            </div>

            <div ref={markStart} className="mt-10 h-[min(34vw,13rem)] w-[min(34vw,13rem)]">
              <motion.div
                className="h-full w-full text-ink"
                style={{ x: markX, y: markY, scale: markScale, opacity: handedOff ? 0 : 1 }}
              >
                <motion.div
                  variants={logoEntrance}
                  onAnimationComplete={(def) => def === "show" && setInteractive(true)}
                  className="h-full w-full"
                >
                  <CosecheroIcon className="h-full w-full" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* aviso de deslizar — solo existe aquí, y aparece justo cuando el gesto funciona */}
      {interactive && !handedOff && (
        <motion.div
          className="absolute inset-x-0 bottom-10 flex justify-center"
          style={{ opacity: cue }}
        >
          <motion.button
            type="button"
            onClick={advance}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_SOFT }}
            className="group flex flex-col items-center gap-3"
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
        </motion.div>
      )}
    </div>
  );
}
