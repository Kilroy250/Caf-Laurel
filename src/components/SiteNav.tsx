"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useTransform } from "framer-motion";
import { CosecheroIcon } from "./CosecheroIcon";
import { EASE_OUT_EXPO } from "./motion/Primitives";
import { useIntro } from "./intro-context";
import { ArrowIcon, WhatsAppIcon } from "./Icons";
import { abrirPedido } from "./Pedido";
import { WHATSAPP_VISIBLE, waLink } from "@/lib/contacto";

// `n` es el número que lleva la sección en la página
const TABS = [
  { id: "nuestro-cafe", n: "01", label: "Nuestro café" },
  { id: "origen", n: "02", label: "Origen" },
  { id: "corona", n: "03", label: "La corona de laurel" },
  { id: "proceso", n: "04", label: "Nuestro proceso" },
];

const IZQUIERDA = TABS.slice(0, 2);
const DERECHA = TABS.slice(2);

export function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function SiteNav() {
  const { phase, progress, navMarkRef } = useIntro();
  const [open, setOpen] = useState(false);

  // las pestañas aparecen en el último tramo de la transición de entrada
  const chromeOpacity = useTransform(progress, [0.5, 0.9], [0, 1]);
  const chromeY = useTransform(progress, [0.5, 0.9], [-8, 0]);
  const markVisible = phase !== "intro";

  const jump = (id: string) => {
    setOpen(false);
    setTimeout(() => goTo(id), open ? 420 : 0);
  };

  const inicio = () => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const comprar = () => {
    setOpen(false);
    setTimeout(() => abrirPedido(), 350);
  };

  // con el menú abierto la página de atrás no se mueve; Escape lo cierra
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* mix-blend-difference invierte la barra sola sobre fondos claros u oscuros */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[90] mix-blend-difference">
        {/* --g: la misma separación entre las cuatro pestañas y el campesino; los 9.8px descuentan el aire transparente del dibujo (17,5 % de su caja de 56px) */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-6 pb-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] [--g:clamp(2rem,6.5vw,7.5rem)] sm:px-10 sm:py-4">
          <motion.div
            style={{ opacity: chromeOpacity, y: chromeY }}
            className="flex items-center"
          >
            <button onClick={inicio} className="pointer-events-auto -my-2 shrink-0 py-2">
              <Image
                src="/images/logo-cafe-laurel-blanco.png"
                alt="Café Laurel — ir al inicio"
                width={760}
                height={307}
                className="h-7 w-auto sm:h-8"
              />
            </button>

            <div className="ml-auto hidden items-center gap-[var(--g)] pr-[calc(var(--g)-9.8px)] lg:flex">
              {IZQUIERDA.map((s) => (
                <button
                  key={s.id}
                  onClick={() => jump(s.id)}
                  className="pointer-events-auto micro -my-3 whitespace-nowrap py-3 text-[0.8125rem] normal-case tracking-[0.01em] text-cream transition-opacity hover:opacity-60"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* el espacio del campesino existe siempre: las pestañas no se mueven cuando aterriza */}
          <div ref={navMarkRef} className="h-11 w-11 sm:h-14 sm:w-14">
            <button
              onClick={inicio}
              aria-label="Ir al inicio"
              tabIndex={markVisible ? 0 : -1}
              style={{ opacity: markVisible ? 1 : 0 }}
              className="pointer-events-auto block h-full w-full text-cream"
            >
              <CosecheroIcon className="h-full w-full" />
            </button>
          </div>

          <motion.div
            style={{ opacity: chromeOpacity, y: chromeY }}
            className="flex items-center justify-end lg:justify-start"
          >
            <div className="hidden items-center gap-[var(--g)] pl-[calc(var(--g)-9.8px)] lg:flex">
              {DERECHA.map((s) => (
                <button
                  key={s.id}
                  onClick={() => jump(s.id)}
                  className="pointer-events-auto micro -my-3 whitespace-nowrap py-3 text-[0.8125rem] normal-case tracking-[0.01em] text-cream transition-opacity hover:opacity-60"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              className="pointer-events-auto micro -my-3.5 -mr-3 px-3 py-3.5 text-[0.8125rem] normal-case tracking-[0.01em] text-cream lg:hidden"
            >
              {open ? "Cerrar" : "Menú"}
            </button>
          </motion.div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          // el panel baja desde arriba y su contenido sube lo mismo: queda quieto mientras
          // el borde lo descubre. Solo transform: fluido también en teléfonos modestos.
          <motion.div
            id="menu-movil"
            className="fixed inset-0 z-[85] overflow-hidden bg-ink lg:hidden"
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            <motion.nav
              aria-label="Secciones"
              className="flex h-full flex-col px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] sm:px-10"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            >
              <div className="flex flex-1 flex-col justify-center">
                {TABS.map((s, i) => (
                  <motion.button
                    key={s.id}
                    onClick={() => jump(s.id)}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: EASE_OUT_EXPO }}
                    className="press flex items-baseline gap-4 border-b border-cream/10 py-5 text-left"
                  >
                    <span className="font-sans text-xs text-rust">{s.n}</span>
                    <span className="display text-[clamp(1.75rem,9vw,3rem)] text-cream">{s.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* la acción principal no se esconde dentro del menú: va abajo, a la mano del pulgar */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + TABS.length * 0.07, duration: 0.6, ease: EASE_OUT_EXPO }}
              >
                <button
                  onClick={comprar}
                  className="press group flex w-full items-center justify-between rounded-full bg-rust py-3.5 pl-6 pr-3.5 text-cream transition"
                >
                  <span className="micro">Comprar ahora</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink">
                    <ArrowIcon className="h-4 w-4" />
                  </span>
                </button>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex min-h-11 items-center justify-center gap-3 text-cream/70"
                >
                  <WhatsAppIcon className="h-5 w-5 text-rust" />
                  <span className="micro">Pedidos · {WHATSAPP_VISIBLE}</span>
                </a>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
