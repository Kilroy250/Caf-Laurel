"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  EASE_OUT_EXPO,
  MaskedLine,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/motion/Primitives";
import { TiltReveal } from "@/components/motion/TiltReveal";
import { SectionHead } from "@/components/SectionHead";

const SPECS = [
  { n: "01", label: "Altura", value: "1.900 m s. n. m." },
  { n: "02", label: "Variedad", value: "Castilla · F6" },
  { n: "03", label: "Proceso", value: "Lavado · secado al sol" },
  { n: "04", label: "Origen", value: "La Plata, Huila" },
  { n: "05", label: "Notas", value: "Caramelo, vainilla, melón dulce" },
];

const SIZES = [
  { id: "250 g", price: 28000 },
  { id: "500 g", price: 54000 },
];

const GRINDS = ["Grano", "Molido"];
const WHATSAPP = "573502725600";

const cop = (n: number) =>
  n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export function NuestroCafe() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<string | null>(null);
  const [grind, setGrind] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);

  const ready = Boolean(size && grind);
  const unit = SIZES.find((s) => s.id === size)?.price ?? 0;

  const href = ready
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
        `Hola, quiero pedir ${qty} bolsa${qty > 1 ? "s" : ""} de Café Laurel de ${size} en ${grind?.toLowerCase()}.`,
      )}`
    : undefined;

  const openPanel = () => {
    setOpen(true);
    setTimeout(
      () => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
      120,
    );
  };

  return (
    <section id="nuestro-cafe" className="bg-ink text-cream">
      <div className="px-6 pb-24 pt-20 sm:px-10 md:pb-32 md:pt-28">
        <SectionHead n="01" label="Nuestro café" tone="dark" />

        <h2 className="mt-10 max-w-[18ch] text-[clamp(2.6rem,7.5vw,7rem)] leading-[0.88]">
          <MaskedLine>
            <span className="display">El mejor café</span>
          </MaskedLine>
          <MaskedLine delay={0.08}>
            <span className="display">de Colombia,</span>
          </MaskedLine>
          <MaskedLine delay={0.16}>
            <span className="display-serif text-rust">por fin en casa.</span>
          </MaskedLine>
        </h2>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* producto en perspectiva */}
          <TiltReveal className="lg:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-soft">
              <Image
                src="/images/producto-bolsa-cafe-fondo-oscuro.jpg"
                alt="Bolsa de Café Laurel — Huila, Finca Pedregal"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </TiltReveal>

          {/* ficha técnica */}
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-10">
            <Reveal>
              <p className="max-w-sm text-lg leading-relaxed text-cream/70">
                Un solo origen, una sola finca, un solo lote. Tostado y empacado
                para que lo pruebes en tu propia tierra.
              </p>
            </Reveal>

            <Stagger className="mt-10" delay={0.1}>
              {SPECS.map((s) => (
                <StaggerItem
                  key={s.n}
                  className="flex items-baseline gap-4 border-t border-cream/12 py-4"
                >
                  <span className="font-sans text-[0.65rem] text-rust">{s.n}</span>
                  <span className="micro w-24 shrink-0 text-cream/40">{s.label}</span>
                  <span className="text-lg font-medium leading-snug">{s.value}</span>
                </StaggerItem>
              ))}
            </Stagger>

            {!open && (
              <Reveal delay={0.15}>
                <button
                  onClick={openPanel}
                  className="group mt-10 inline-flex items-center gap-3 rounded-full bg-rust py-3.5 pl-6 pr-3.5 text-cream transition-colors hover:bg-cream hover:text-ink"
                >
                  <span className="micro">Quiero uno</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink transition-transform group-hover:translate-y-0.5 group-hover:bg-rust group-hover:text-cream">
                    ↓
                  </span>
                </button>
              </Reveal>
            )}
          </div>
        </div>

        {/* pedido */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
              className="overflow-hidden"
            >
              <div className="mt-20 border-t border-cream/15 pt-12">
                <div className="flex items-baseline justify-between">
                  <span className="micro text-rust">Arma tu pedido</span>
                  <button onClick={() => setOpen(false)} className="micro text-cream/40">
                    Cerrar
                  </button>
                </div>

                <div className="mt-10 grid gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-7">
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
                      className="mt-10"
                    />

                    <div className="mt-10">
                      <p className="micro text-cream/40">Cantidad</p>
                      <div className="mt-4 flex items-center gap-5">
                        <Stepper onClick={() => setQty((q) => Math.max(1, q - 1))} label="−" />
                        <span className="w-8 text-center text-2xl font-semibold">{qty}</span>
                        <Stepper onClick={() => setQty((q) => q + 1)} label="+" />
                      </div>
                    </div>
                  </div>

                  {/* resumen */}
                  <div className="lg:col-span-4 lg:col-start-9">
                    <div className="border-t border-cream/15 pt-6">
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
                            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-rust py-3.5 pl-6 pr-3.5 text-cream transition-colors hover:bg-cream hover:text-ink"
                          >
                            <span className="micro">Pedir por WhatsApp</span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink transition-transform group-hover:translate-x-0.5 group-hover:bg-rust group-hover:text-cream">
                              →
                            </span>
                          </motion.a>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
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
