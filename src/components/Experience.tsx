"use client";

import { type ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { Intro } from "./Intro";
import { SiteNav } from "./SiteNav";
import { INTRO_RANGE, IntroContext, type IntroPhase } from "./intro-context";

/**
 * Orquesta la entrada al sitio. El scroll del usuario alimenta un valor
 * virtual (0 → INTRO_RANGE) que un resorte sobreamortiguado suaviza: la
 * transición sigue la rueda o el dedo, se puede devolver, y nunca rebota.
 */
export function Experience({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("intro");

  const virtual = useMotionValue(0);
  const raw = useTransform(virtual, [0, INTRO_RANGE], [0, 1]);
  const progress = useSpring(raw, { stiffness: 55, damping: 22 });

  const heroLogoRef = useRef<HTMLDivElement>(null);
  const navMarkRef = useRef<HTMLDivElement>(null);

  const arrive = useCallback(() => setPhase((p) => (p === "intro" ? "arrived" : p)), []);
  const release = useCallback(() => setPhase("released"), []);

  const value = useMemo(
    () => ({ phase, progress, heroLogoRef, navMarkRef }),
    [phase, progress],
  );

  return (
    <IntroContext.Provider value={value}>
      {phase !== "released" && (
        <Intro virtual={virtual} onArrive={arrive} onRelease={release} />
      )}
      <SiteNav />
      {children}
    </IntroContext.Provider>
  );
}
