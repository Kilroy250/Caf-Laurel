"use client";

import { useSyncExternalStore } from "react";

/** Igual que la variante `pin:` de globals.css. */
export const PIN_QUERY = "(min-width: 64rem) and (min-height: 40rem)";

/** Igual que la variante `vertical:` de globals.css: celular o tablet en vertical. */
export const VERTICAL_QUERY = "(max-width: 63.98rem) and (orientation: portrait)";

/**
 * true cuando la consulta CSS se cumple. En el servidor responde false
 * (versión móvil) y se corrige al hidratar.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
