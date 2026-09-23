"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
import { LayoutGroup } from "framer-motion";
import { Intro } from "./Intro";
import { SiteNav } from "./SiteNav";

const EnteredContext = createContext(false);

/** true una vez que la intro dio paso al sitio. */
export const useEntered = () => useContext(EnteredContext);

/**
 * Orquesta la entrada al sitio. El campesino es un único elemento compartido
 * (layoutId) entre la intro y la barra: al pasar de una a otra, Framer Motion
 * interpola su tamaño y posición — de grande y centrado, a pequeño y arriba.
 *
 * El contenido se renderiza siempre visible bajo la intro: así ninguna
 * animación puede dejar la página en blanco si no llega a ejecutarse.
 */
export function Experience({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(false);

  return (
    <LayoutGroup>
      <EnteredContext.Provider value={entered}>
        {!entered && <Intro onEnter={() => setEntered(true)} />}
        <SiteNav showMark={entered} />
        {children}
      </EnteredContext.Provider>
    </LayoutGroup>
  );
}
