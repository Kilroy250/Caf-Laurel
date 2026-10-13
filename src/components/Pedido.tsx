"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/components/motion/Primitives";
import { BeanDrift, type GranoConfig } from "@/components/motion/BeanDrift";
import { ArrowIcon, WhatsAppIcon } from "@/components/Icons";
import { waLink } from "@/lib/contacto";

// Precio al público, por bolsa (500 g primero: es el de mejor valor)
const SIZES = [
  { gramos: 500, price: 49000 },
  { gramos: 250, price: 29000 },
];

// Precio al por mayor por bolsa, según cantidad mínima de unidades
const MAYOR: Record<number, [number, number][]> = {
  500: [[10, 44000], [15, 42600], [20, 41200], [25, 39700]],
  250: [[10, 26000], [15, 25200], [20, 24400], [25, 23500]],
};

const GRINDS = ["Grano", "Molido"];

type Modo = "casa" | "mayor";

const miles = (n: number) => n.toLocaleString("es-CO");

// Cualquier botón "Quiero uno" de la página abre el pedido con este evento.
const ABRIR_PEDIDO = "laurel:abrir-pedido";
export function abrirPedido({ mayorista = false } = {}) {
  window.dispatchEvent(new CustomEvent(ABRIR_PEDIDO, { detail: { mayorista } }));
}

// Granos del pedido: pocos y separados. Los lejanos (pequeños, desenfocados) van
// primero en la lista para quedar siempre detrás de los nítidos. Empiezan a la
// altura de las presentaciones y bajan todos juntos, el mismo tramo, en cada paso.
const GRANOS: GranoConfig[] = [
  { left: "49%", top: "12%", size: 38, depth: 0.4, rot: [30, 30], blur: 3, desktop: true, opacity: 0.55 },
  { left: "92%", top: "7%", size: 42, depth: 0.4, rot: [-40, -40], blur: 3, desktop: true, opacity: 0.55 },
  { left: "3.5%", top: "24%", size: 54, depth: 0.6, rot: [60, 60], blur: 1.5, desktop: true },
  { left: "50%", top: "30%", size: 72, depth: 1, rot: [-15, -15], blur: 0, desktop: true },
  { left: "97.5%", top: "26%", size: 84, depth: 1, rot: [20, 20], blur: 0 },
];

/** El pedido se abre encima de la página, sin moverla: al cerrar, todo sigue donde estaba. */
export function Pedido() {
  const [open, setOpen] = useState(false);
  const [modo, setModo] = useState<Modo>("casa");

  useEffect(() => {
    const onOpen = (e: Event) => {
      setModo((e as CustomEvent<{ mayorista: boolean }>).detail?.mayorista ? "mayor" : "casa");
      setOpen(true);
    };
    window.addEventListener(ABRIR_PEDIDO, onOpen);
    return () => window.removeEventListener(ABRIR_PEDIDO, onOpen);
  }, []);

  // con el pedido abierto la página de atrás no se mueve
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
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Arma tu pedido"
          className="fixed inset-0 z-[95] overflow-y-auto overflow-x-hidden bg-cream text-ink"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        >
          <Contenido key={modo} modo={modo} setModo={setModo} onClose={() => setOpen(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Contenido({
  modo,
  setModo,
  onClose,
}: {
  modo: Modo;
  setModo: (m: Modo) => void;
  onClose: () => void;
}) {
  const [gramos, setGramos] = useState<number | null>(null);
  const [grind, setGrind] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [qtyHecha, setQtyHecha] = useState(false);
  const [tramo, setTramo] = useState<number | null>(null); // unidades mínimas al por mayor
  const [enviado, setEnviado] = useState(false); // tocó el botón de WhatsApp
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => closeRef.current?.focus({ preventScroll: true }), []);

  const mayor = modo === "mayor";
  const unidades = mayor ? tramo ?? 0 : qty;
  const precioUnidad = (g: number) =>
    mayor ? MAYOR[g].find(([u]) => u === (tramo ?? 10))![1] : SIZES.find((s) => s.gramos === g)!.price;

  const pasoCantidad = mayor ? tramo !== null : qtyHecha;
  // cada paso completado hace bajar los granos; al deshacerlo, vuelven a subir
  const ready = gramos !== null && grind !== null && unidades > 0;
  const stage =
    Number(gramos !== null) + Number(grind !== null) + Number(pasoCantidad) + Number(enviado && ready);
  const total = ready ? precioUnidad(gramos) * unidades : 0;

  // tocar lo ya elegido lo deselecciona
  const toggle = <T,>(set: (fn: (v: T | null) => T | null) => void, v: T) => set((cur) => (cur === v ? null : v));

  const cambiarQty = (d: number) => {
    if (d < 0 && qty === 1) return setQtyHecha(false);
    setQty((q) => Math.max(1, q + d));
    setQtyHecha(true);
  };

  const mensaje = ready
    ? mayor
      ? `Hola, quiero hacer un pedido al por mayor de Café Laurel: ${unidades} bolsas de ${gramos} g en ${grind!.toLowerCase()}.`
      : `Hola, quiero pedir ${unidades} bolsa${unidades > 1 ? "s" : ""} de Café Laurel de ${gramos} g en ${grind!.toLowerCase()}.`
    : "";

  return (
    <div className="relative min-h-svh px-6 pb-16 pt-24 sm:px-10 pin:flex pin:h-svh pin:items-center pin:py-0">
      <BeanDrift granos={GRANOS} stage={stage} stageStep={9} stageByDepth={false} className="z-0" />

      {/* barra propia: el menú de la página queda detrás */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 sm:px-10">
        <Image src="/images/logo-cafe-laurel-negro.png" alt="Café Laurel" width={760} height={307} className="h-7 w-auto sm:h-8" />
        <button
          ref={closeRef}
          onClick={onClose}
          className="micro flex items-center gap-2 rounded text-ink/50 outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-rust/50"
        >
          Cerrar <span className="text-base leading-none">×</span>
        </button>
      </div>

      <motion.div
        className="relative z-10 grid w-full gap-12 pin:grid-cols-2 pin:items-center pin:gap-0 pin:[--w:calc(min(100svh-12rem,40rem)*0.8)]"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } } }}
      >
        {/* producto */}
        <Entra className="pin:flex pin:justify-center">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-cream-deep pin:mx-0 pin:w-[var(--w)] pin:max-w-none">
            <Image
              src="/images/producto-bolsa-cafe-fondo-claro.jpg"
              alt="Bolsa de Café Laurel Huila, Finca Pedregal"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 36vw"
              className="object-cover"
            />
          </div>
        </Entra>

        {/* información: con aire, un paso por renglón */}
        <div className="pin:flex pin:justify-center">
          <div className="w-full pin:max-w-[var(--w)]">
          <Entra>
            <p className="micro text-rust">{mayor ? "Pedido al por mayor" : "Arma tu pedido"}</p>
            <h2 className="display mt-3 text-[clamp(2rem,3.2vw,2.75rem)]">Café Laurel</h2>
            <p className="mt-2 text-sm text-ink/55">Huila · Finca Pedregal · Caramelo, vainilla, melón dulce</p>
          </Entra>

          <div className="mt-6">
            <Entra>
              <Paso n={1} titulo="Presentación" hecho={gramos !== null}>
                <div role="radiogroup" aria-label="Presentación" className="grid grid-cols-2 gap-3">
                  {SIZES.map((s) => {
                    const active = gramos === s.gramos;
                    return (
                      <button
                        key={s.gramos}
                        role="radio"
                        aria-checked={active}
                        onClick={() => toggle(setGramos, s.gramos)}
                        className={`rounded-md border px-5 py-4 text-left transition-colors ${
                          active ? "border-rust bg-rust text-cream" : "border-ink/15 bg-cream hover:border-rust/60"
                        }`}
                      >
                        <span className="display block text-[clamp(2.1rem,3vw,2.75rem)] leading-none">
                          {s.gramos}
                          <span className="ml-0.5 text-[0.55em] normal-case">g</span>
                        </span>
                        <span className={`mt-2.5 block text-base font-medium ${active ? "text-cream/90" : "text-ink/60"}`}>
                          ${miles(precioUnidad(s.gramos))}
                          {mayor && <span className="text-sm font-normal opacity-75"> c/u</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Paso>
            </Entra>

            <Entra>
              <Paso n={2} titulo="Molienda" hecho={grind !== null} inline>
                <div role="radiogroup" aria-label="Molienda" className="grid grid-cols-2 gap-1 rounded-full border border-ink/15 bg-cream p-1">
                  {GRINDS.map((g) => (
                    <button
                      key={g}
                      role="radio"
                      aria-checked={grind === g}
                      onClick={() => toggle(setGrind, g)}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                        grind === g ? "bg-rust text-cream" : "text-ink/60 hover:text-ink"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </Paso>
            </Entra>

            <Entra>
              {mayor ? (
                <Paso n={3} titulo="Unidades" hecho={tramo !== null}>
                  <div role="radiogroup" aria-label="Unidades" className="grid grid-cols-4 gap-2">
                    {MAYOR[gramos ?? 500].map(([u, p]) => {
                      const active = tramo === u;
                      const ahorro = Math.round((1 - p / SIZES.find((s) => s.gramos === (gramos ?? 500))!.price) * 100);
                      return (
                        <button
                          key={u}
                          role="radio"
                          aria-checked={active}
                          onClick={() => toggle(setTramo, u)}
                          className={`rounded-md border px-2 py-3 text-center transition-colors ${
                            active ? "border-rust bg-rust text-cream" : "border-ink/15 bg-cream hover:border-rust/60"
                          }`}
                        >
                          <span className="block text-lg font-bold leading-none">{u}</span>
                          <span className={`mt-1 block text-[0.7rem] ${active ? "text-cream/80" : "text-ink/45"}`}>unidades</span>
                          <span className={`mt-2 block text-xs font-semibold ${active ? "text-cream" : "text-rust"}`}>−{ahorro}%</span>
                        </button>
                      );
                    })}
                  </div>
                </Paso>
              ) : (
                <Paso n={3} titulo="Cantidad" hecho={qtyHecha} inline>
                  <div className="flex items-center gap-1 rounded-full border border-ink/15 bg-cream p-1">
                    <Stepper onClick={() => cambiarQty(-1)} label="−" />
                    <span className="w-8 text-center text-base font-semibold tabular-nums">{qty}</span>
                    <Stepper onClick={() => cambiarQty(1)} label="+" />
                  </div>
                </Paso>
              )}
            </Entra>

            <Entra>
              <a
                href={ready ? waLink(mensaje) : undefined}
                onClick={() => setEnviado(true)}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!ready}
                className={`group mt-7 flex w-full items-center justify-between rounded-full py-3.5 pl-6 pr-3.5 transition-colors ${
                  ready ? "bg-ink text-cream hover:bg-rust" : "pointer-events-none bg-ink/[0.06] text-ink/40"
                }`}
              >
                <span className="flex items-center gap-3">
                  <WhatsAppIcon className="h-5 w-5" />
                  <span className="micro whitespace-nowrap">
                    {ready ? (
                      <>
                        Pedir<span className="hidden sm:inline">{mayor ? " al por mayor" : " por WhatsApp"}</span>
                      </>
                    ) : (
                      "Completa los pasos"
                    )}
                  </span>
                </span>
                {ready && (
                  <span className="flex items-center gap-3">
                    <span className="text-base font-semibold tabular-nums">${miles(total)}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink transition-transform group-hover:translate-x-0.5">
                      <ArrowIcon className="h-4 w-4" />
                    </span>
                  </span>
                )}
              </a>

              {/* cambio de modo, discreto, debajo de la acción principal */}
              <div className="mt-5 text-center text-sm text-ink/55">
                {mayor ? (
                  <>
                    ¿Más de 25 unidades? Escríbenos y lo cotizamos.{" "}
                    <button onClick={() => setModo("casa")} className="ml-1 font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
                      Volver a compra individual
                    </button>
                  </>
                ) : (
                  <>
                    ¿Tienes un negocio?{" "}
                    <button onClick={() => setModo("mayor")} className="font-semibold text-ink underline decoration-rust/50 underline-offset-4 transition-colors hover:text-rust">
                      Compra al por mayor desde 10 unidades
                    </button>
                  </>
                )}
              </div>
            </Entra>
          </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/** Entrada escalonada de cada bloque al abrir el pedido. */
function Entra({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Un paso del pedido: número (que se marca al completarlo), nombre y su control. */
function Paso({
  n,
  titulo,
  hecho,
  inline = false,
  children,
}: {
  n: number;
  titulo: string;
  hecho: boolean;
  inline?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`border-b border-ink/10 py-5 ${inline ? "flex items-center justify-between gap-6" : ""}`}>
      <p className={`flex items-center gap-3 ${inline ? "" : "mb-4"}`}>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.7rem] font-bold transition-colors ${
            hecho ? "bg-rust text-cream" : "border border-ink/20 bg-cream text-ink/50"
          }`}
        >
          {hecho ? "✓" : n}
        </span>
        <span className="text-sm font-semibold">{titulo}</span>
      </p>
      {children}
    </div>
  );
}

function Stepper({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label === "+" ? "Sumar" : "Restar"}
      className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition-colors hover:bg-ink hover:text-cream"
    >
      {label}
    </button>
  );
}
