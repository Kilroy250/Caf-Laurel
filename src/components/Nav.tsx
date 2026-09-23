"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const LINKS = [
  { id: "nuestro-cafe", label: "Nuestro Café" },
  { id: "por-que-existimos", label: "Por qué existimos" },
  { id: "corona-laurel", label: "La corona de laurel" },
  { id: "origen", label: "Origen" },
  { id: "proceso", label: "Nuestro proceso" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-ink/90 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <button onClick={() => go("hero")} className="flex items-center gap-2">
          <Image
            src="/images/logo-cafe-laurel-blanco.png"
            alt="Café Laurel"
            width={120}
            height={48}
            className="h-8 w-auto"
          />
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="text-xs uppercase tracking-[0.14em] text-cream/85 hover:text-gold transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-cream text-xs uppercase tracking-[0.14em] flex items-center gap-2"
        >
          {open ? "Cerrar" : "Menú"}
        </button>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col gap-1 bg-ink px-5 pb-5">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="py-3 text-left text-sm uppercase tracking-[0.14em] text-cream/85 border-t border-cream/10"
            >
              {l.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
