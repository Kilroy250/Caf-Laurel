"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  EASE_OUT_EXPO,
  MaskedLine,
  Reveal,
  Stagger,
  StaggerItem,
  useScrollLinked,
} from "@/components/motion/Primitives";
import { SectionHead } from "@/components/SectionHead";
import { ArrowIcon, WhatsAppIcon } from "@/components/Icons";
import { PIN_QUERY, useMediaQuery } from "@/components/useMediaQuery";
import { MENSAJE_MAYORISTA, waLink } from "@/lib/contacto";

const SPECS = [
  { label: "Altura", value: "1.900 m s. n. m." },
  { label: "Variedad", value: "Castilla · F6" },
  { label: "Proceso", value: "Lavado · secado al sol" },
  { label: "Origen", value: "Finca Pedregal, La Plata, Huila" },
  { label: "Notas", value: "Caramelo, vainilla, melón dulce" },
];

// Precio al público — el mismo de /images/precios-al-publico.webp
const SIZES = [
  { id: "250 g", price: 29000 },
  { id: "500 g", price: 49000 },
];

const GRINDS = ["Grano", "Molido"];

const cop = (n: number) =>
  n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

// Cualquier botón "Quiero uno" de la página abre el pedido con este evento.
const ABRIR_PEDIDO = "laurel:abrir-pedido";
export function abrirPedido({ mayorista = false } = {}) {
  window.dispatchEvent(new CustomEvent(ABRIR_PEDIDO, { detail: { mayorista } }));
}

export function NuestroCafe() {
  const reduce = useReducedMotion();
  const wide = useMediaQuery(PIN_QUERY);
  // la escena fija solo existe en pantallas grandes y con movimiento permitido
  const pinned = wide && !reduce;

  const sceneRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mayorista, setMayorista] = useState(false);

  // entrada: desde que la sección asoma hasta que toca el borde superior
  const { scrollYProgress: entry } = useScroll({
    target: sceneRef,
    offset: ["start end", "start start"],
  });
  // escena fija: mientras la sección está anclada
  const { scrollYProgress: scene } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  // la foto se abre desde un marco más estrecho y se asienta con un zoom lento
  const clip = useScrollLinked(entry, [0.15, 1], ["inset(14% 16% 14% 16%)", "inset(0% 0% 0% 0%)"]);
  const zoomIn = useTransform(entry, [0.15, 1], [1.22, 1.07]);
  const zoomHold = useTransform(scene, [0, 1], [1.07, 1]);
  const zoom = useTransform(() => (scene.get() > 0 ? zoomHold.get() : zoomIn.get()));
  const cta = useScrollLinked(scene, [0.56, 0.7], [0, 1]);
  const ctaY = useTransform(scene, [0.56, 0.7], [12, 0]);
  const ctaEvents = useTransform(cta, (v) => (v > 0.5 ? "auto" : "none"));

  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      if ((e as CustomEvent<{ mayorista: boolean }>).detail?.mayorista) setMayorista(true);
      // tras montar el panel, llevarlo a la vista
      setTimeout(
        () => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        80,
      );
    };
    window.addEventListener(ABRIR_PEDIDO, onOpen);
    return () => window.removeEventListener(ABRIR_PEDIDO, onOpen);
  }, []);

  const quieroUno = (
    <button
      onClick={() => abrirPedido()}
      className="group inline-flex items-center gap-3 rounded-full bg-rust py-3.5 pl-6 pr-3.5 text-cream transition-colors hover:bg-cream hover:text-ink"
    >
      <span className="micro">Quiero uno</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink transition-colors group-hover:bg-rust group-hover:text-cream">
        <ArrowIcon className="h-4 w-4" />
      </span>
    </button>
  );

  return (
    <section id="nuestro-cafe" className="bg-ink text-cream">
      {/* 240vh de alto = la escena queda fija durante 140vh de scroll */}
      <div ref={sceneRef} className="relative pin:h-[240vh]">
        <div className="flex flex-col px-6 pb-20 pt-20 sm:px-10 md:pt-28 pin:sticky pin:top-0 pin:h-svh pin:pb-10 pin:pt-24">
          <SectionHead n="01" label="Nuestro café" tone="dark" />

          <div className="mt-12 grid min-h-0 flex-1 gap-14 pin:mt-6 pin:grid-cols-12 pin:items-center pin:gap-8">
            {/* título + tesis */}
            <div className="pin:col-span-4">
              <h2 className="text-[clamp(2.5rem,9vw,4rem)] leading-[0.9] pin:text-[clamp(2.4rem,3.6vw,4rem)]">
                <MaskedLine>
                  <span className="display">Antes se iba</span>
                </MaskedLine>
                <MaskedLine delay={0.08}>
                  <span className="display">lejos.</span>
                </MaskedLine>
                <MaskedLine delay={0.16}>
                  <span className="display-script text-rust">Ahora se queda en casa.</span>
                </MaskedLine>
              </h2>

              <Reveal delay={0.2}>
                <p className="mt-7 max-w-sm text-lg leading-relaxed text-cream/70 pin:text-base xl:text-lg">
                  Ese café solía viajar lejos, porque afuera pagan más. Laurel
                  existe para devolvértelo: un solo origen, una sola finca, un
                  solo lote.
                </p>
              </Reveal>
            </div>

            {/* producto */}
            <div className="pin:col-span-4 pin:flex pin:justify-center">
              {/* key: al pasar de móvil a escritorio (se sabe tras cargar) el marco se recrea con su propia animación */}
              <motion.div
                key={pinned ? "fija" : "flujo"}
                style={pinned ? { clipPath: clip } : undefined}
                initial={pinned ? false : { opacity: 0, y: 30 }}
                whileInView={pinned ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, ease: EASE_OUT_EXPO }}
                className="relative mx-auto aspect-[2/3] w-full max-w-md overflow-hidden bg-ink-soft pin:max-w-[min(46svh,27rem)]"
              >
                <motion.div style={pinned ? { scale: zoom } : undefined} className="absolute inset-0">
                  <Image
                    src="/images/producto-bolsa-cafe-fondo-oscuro.jpg"
                    alt="Bolsa de Café Laurel, Huila — Finca Pedregal, sobre una base de mármol negro"
                    fill
                    sizes="(max-width: 1024px) 90vw, 30vw"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* ficha: cada dato aparece con el scroll */}
            <div className="pin:col-span-4 pin:xl:col-span-3 pin:xl:col-start-10">
              <SpecList pinned={pinned} scene={scene} />

              <div className="mt-10 pin:mt-8">
                {pinned ? (
                  <motion.div style={{ opacity: cta, y: ctaY, pointerEvents: ctaEvents }}>
                    {quieroUno}
                  </motion.div>
                ) : (
                  <Reveal delay={0.1}>{quieroUno}</Reveal>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* pedido */}
      <div ref={panelRef} className="scroll-mt-20 px-6 sm:px-10">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
              className="overflow-hidden"
            >
              <div className="border-t border-cream/15 pb-24 pt-10 md:pb-32">
                <div className="flex items-baseline justify-between">
                  <span className="micro text-rust">Arma tu pedido</span>
                  <button
                    onClick={() => {
                      setOpen(false);
                      setMayorista(false);
                    }}
                    className="micro text-cream/40 transition-colors hover:text-cream"
                  >
                    Cerrar
                  </button>
                </div>

                <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-6">
                    <PriceImage
                      src="/images/precios-al-publico.webp"
                      width={1440}
                      height={1290}
                      alt="Precio al público, presentación individual: 500 gramos a $49.000 y 250 gramos a $29.000."
                    />
                  </div>

                  <div className="lg:col-span-5 lg:col-start-8">
                    <Pedido />

                    <div className="mt-12 border-t border-cream/15 pt-8">
                      <p className="micro text-cream/40">¿Compras para tu negocio?</p>
                      <button
                        onClick={() => setMayorista((v) => !v)}
                        aria-expanded={mayorista}
                        className="mt-4 inline-flex items-center gap-3 rounded-full border border-cream/25 px-6 py-3.5 transition-colors hover:border-cream"
                      >
                        <span className="micro">
                          {mayorista ? "Ocultar precio al por mayor" : "Precio al por mayor"}
                        </span>
                        <motion.span
                          animate={{ rotate: mayorista ? 45 : 0 }}
                          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                          className="text-lg leading-none"
                        >
                          +
                        </motion.span>
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {mayorista && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                      className="overflow-hidden"
                    >
                      <div className="mx-auto mt-16 max-w-4xl">
                        <PriceImage
                          src="/images/precios-al-por-mayor.webp"
                          width={1440}
                          height={1398}
                          alt="Precio al por mayor por volumen de compra. 500 gramos: 10 unidades mínimo $44.000, 15 unidades $42.600, 20 unidades $41.200, 25 unidades $39.700. 250 gramos: 10 unidades mínimo $26.000, 15 unidades $25.200, 20 unidades $24.400, 25 unidades $23.500."
                        />
                        <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
                          <p className="max-w-sm text-base leading-relaxed text-cream/60">
                            Precios por unidad, desde 10 bolsas. Escríbenos y armamos tu
                            pedido.
                          </p>
                          <a
                            href={waLink(MENSAJE_MAYORISTA)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 rounded-full bg-cream py-3.5 pl-5 pr-3.5 text-ink transition-colors hover:bg-rust hover:text-cream"
                          >
                            <WhatsAppIcon className="h-5 w-5" />
                            <span className="micro">Pedir al por mayor</span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-cream transition-transform group-hover:translate-x-0.5">
                              <ArrowIcon className="h-4 w-4" />
                            </span>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/** Ficha técnica. Fija: cada dato llega en su tramo de scroll. Normal: escalonada al entrar. */
function SpecList({ pinned, scene }: { pinned: boolean; scene: MotionValue<number> }) {
  if (!pinned) {
    return (
      <Stagger delay={0.1}>
        {SPECS.map((s) => (
          <StaggerItem key={s.label} className="border-t border-cream/12 py-3.5">
            <SpecText label={s.label} value={s.value} />
          </StaggerItem>
        ))}
      </Stagger>
    );
  }

  return (
    <div>
      {SPECS.map((s, i) => (
        <PinnedSpec key={s.label} scene={scene} from={0.04 + i * 0.1}>
          <SpecText label={s.label} value={s.value} />
        </PinnedSpec>
      ))}
    </div>
  );
}

function PinnedSpec({
  scene,
  from,
  children,
}: {
  scene: MotionValue<number>;
  from: number;
  children: ReactNode;
}) {
  const range = [from, from + 0.16];
  const line = useTransform(scene, range, [0, 1]);
  const opacity = useScrollLinked(scene, [from + 0.04, from + 0.16], [0, 1]);
  const y = useTransform(scene, [from + 0.04, from + 0.16], [14, 0]);

  return (
    <div className="relative py-3 xl:py-3.5">
      <motion.span
        style={{ scaleX: line }}
        className="rule absolute left-0 top-0 origin-left bg-cream/15"
      />
      <motion.div style={{ opacity, y }}>{children}</motion.div>
    </div>
  );
}

function SpecText({ label, value }: { label: string; value: string }) {
  return (
    <>
      <p className="micro text-cream/40">{label}</p>
      <p className="mt-1.5 text-lg font-medium leading-snug">{value}</p>
    </>
  );
}

/** Las tablas de precios son imágenes: en móvil se pueden abrir en grande. */
function PriceImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <figure>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 1024px) 100vw, 56rem"
        className="h-auto w-full rounded-sm"
      />
      <figcaption className="mt-3 lg:hidden">
        <a href={src} target="_blank" rel="noopener noreferrer" className="micro text-cream/45 underline underline-offset-4">
          Ver en tamaño completo
        </a>
      </figcaption>
    </figure>
  );
}

function Pedido() {
  const [size, setSize] = useState<string | null>(null);
  const [grind, setGrind] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const ready = Boolean(size && grind);
  const unit = SIZES.find((s) => s.id === size)?.price ?? 0;
  const href = ready
    ? waLink(
        `Hola, quiero pedir ${qty} bolsa${qty > 1 ? "s" : ""} de Café Laurel de ${size} en ${grind?.toLowerCase()}.`,
      )
    : undefined;

  return (
    <div>
      <Choice
        label="Presentación"
        options={SIZES.map((s) => ({ id: s.id, sub: cop(s.price) }))}
        value={size}
        onChange={setSize}
      />
      <Choice
        label="Molienda"
        options={GRINDS.map((g) => ({ id: g }))}
        value={grind}
        onChange={setGrind}
        className="mt-8"
      />

      <div className="mt-8">
        <p className="micro text-cream/40">Cantidad</p>
        <div className="mt-4 flex items-center gap-5">
          <Stepper onClick={() => setQty((q) => Math.max(1, q - 1))} label="−" />
          <span className="w-8 text-center text-2xl font-semibold">{qty}</span>
          <Stepper onClick={() => setQty((q) => q + 1)} label="+" />
        </div>
      </div>

      <div className="mt-10 border-t border-cream/15 pt-6">
        <p className="micro text-cream/40">Total estimado</p>
        <p className="mt-2 text-[clamp(2.2rem,6vw,3.5rem)] leading-none">
          <span className="display">{ready ? cop(unit * qty) : "—"}</span>
        </p>
        <p className="mt-4 text-sm leading-relaxed text-cream/50">
          {ready
            ? `${qty} × ${size} en ${grind?.toLowerCase()}. Confirmamos envío por WhatsApp.`
            : "Elige presentación y molienda para ver el total."}
        </p>

        <AnimatePresence>
          {ready && (
            <motion.a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-rust py-3.5 pl-5 pr-3.5 text-cream transition-colors hover:bg-cream hover:text-ink"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span className="micro">Pedir por WhatsApp</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink transition-colors group-hover:bg-rust group-hover:text-cream">
                <ArrowIcon className="h-4 w-4" />
              </span>
            </motion.a>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Choice({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: { id: string; sub?: string }[];
  value: string | null;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="micro text-cream/40">{label}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {options.map((o) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              onClick={() => onChange(o.id)}
              aria-pressed={active}
              className={`rounded-full border px-6 py-3 text-left transition-colors ${
                active
                  ? "border-rust bg-rust text-cream"
                  : "border-cream/20 text-cream/80 hover:border-cream/60"
              }`}
            >
              <span className="text-base font-semibold">{o.id}</span>
              {o.sub && (
                <span className={`ml-3 text-sm ${active ? "text-cream/80" : "text-cream/45"}`}>
                  {o.sub}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Stepper({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label === "+" ? "Sumar" : "Restar"}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-xl transition-colors hover:border-rust hover:text-rust"
    >
      {label}
    </button>
  );
}
