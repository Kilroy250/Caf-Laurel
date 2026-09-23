"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, RevealStagger, revealItem } from "@/components/Reveal";

const STATS = [
  { label: "Altura", value: "1.900 m s. n. m." },
  { label: "Variedad", value: "Castilla · F6" },
  { label: "Proceso", value: "Lavado · Secado al sol" },
  { label: "Origen", value: "La Plata, Huila · Finca Pedregal" },
  { label: "Notas", value: "Caramelo, vainilla y melón dulce" },
];

const SIZES = [
  { id: "250", label: "250 g", price: 28000 },
  { id: "500", label: "500 g", price: 54000 },
] as const;

const GRINDS = [
  { id: "grano", label: "Grano" },
  { id: "molido", label: "Molido" },
] as const;

const WHATSAPP_NUMBER = "573502725600";

function formatCOP(n: number) {
  return n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

export function NuestroCafe() {
  const [ordering, setOrdering] = useState(false);
  const [size, setSize] = useState<(typeof SIZES)[number]["id"] | null>(null);
  const [grind, setGrind] = useState<(typeof GRINDS)[number]["id"] | null>(null);
  const [qty, setQty] = useState(1);

  const ready = size !== null && grind !== null;
  const selectedSize = SIZES.find((s) => s.id === size);

  const waHref = ready
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hola, estoy interesado en comprar ${qty} bolsa${qty > 1 ? "s" : ""} de café Laurel de ${selectedSize?.label} en ${grind}.`
      )}`
    : undefined;

  return (
    <section id="nuestro-cafe" className="bg-cream px-6 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Nuestro café</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            El mejor café de Colombia,
            <br />
            <span className="font-serif-italic font-normal text-gold">
              por fin en Colombia.
            </span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-ink/80">
            Tostado y empacado para que pruebes, en tu propia tierra, el café que
            antes solo viajaba lejos.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl bg-ink">
              <Image
                src="/images/producto-bolsa-cafe-fondo-oscuro.jpg"
                alt="Bolsa de Café Laurel — Huila, Finca Pedregal"
                width={900}
                height={1350}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <RevealStagger className="grid grid-cols-2 gap-x-6 gap-y-8">
            {STATS.map((s) => (
              <motion.div key={s.label} variants={revealItem}>
                <p className="text-xs uppercase tracking-[0.2em] text-gold">{s.label}</p>
                <p className="mt-1 text-lg font-semibold leading-snug">{s.value}</p>
              </motion.div>
            ))}
          </RevealStagger>
        </div>

        <Reveal delay={0.2} className="mt-14 flex justify-center md:justify-start">
          {!ordering && (
            <button
              onClick={() => setOrdering(true)}
              className="rounded-full bg-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-gold hover:text-ink"
            >
              Quiero uno
            </button>
          )}
        </Reveal>

        <AnimatePresence>
          {ordering && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-10 rounded-3xl border border-ink/10 bg-white/60 p-6 sm:p-10">
                <p className="text-xs uppercase tracking-[0.2em] text-gold">Arma tu pedido</p>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-ink/70">Tamaño</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {SIZES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSize(s.id)}
                        className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                          size === s.id
                            ? "border-ink bg-ink text-cream"
                            : "border-ink/20 text-ink hover:border-ink/50"
                        }`}
                      >
                        {s.label} · {formatCOP(s.price)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-ink/70">Tipo</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {GRINDS.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setGrind(g.id)}
                        className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                          grind === g.id
                            ? "border-ink bg-ink text-cream"
                            : "border-ink/20 text-ink hover:border-ink/50"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-ink/70">Cantidad</p>
                  <div className="mt-3 flex items-center gap-4">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-lg font-semibold hover:border-ink/50"
                      aria-label="Restar"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-lg font-semibold">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-lg font-semibold hover:border-ink/50"
                      aria-label="Sumar"
                    >
                      +
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {ready && (
                    <motion.a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-transform hover:scale-[1.02]"
                    >
                      Pedir por WhatsApp
                    </motion.a>
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
