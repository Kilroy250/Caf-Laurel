"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { MaskedLine, Reveal } from "@/components/motion/Primitives";
import { abrirPedido } from "@/components/Pedido";
import { goTo } from "@/components/SiteNav";
import { ArrowIcon, InstagramIcon, WhatsAppIcon } from "@/components/Icons";
import { INSTAGRAM, INSTAGRAM_URL, WHATSAPP_VISIBLE, waLink } from "@/lib/contacto";

const SECCIONES = [
  { id: "nuestro-cafe", label: "Nuestro café" },
  { id: "origen", label: "Origen" },
  { id: "corona", label: "La corona de laurel" },
  { id: "proceso", label: "Nuestro proceso" },
];

export function Contacto() {
  return (
    <footer id="contacto" data-cta className="bg-cream text-ink pin:snap-start">
      <div className="px-6 pb-8 pt-24 sm:px-10 md:pt-32 pin:flex pin:min-h-svh pin:flex-col pin:justify-center pin:pt-28">
        {/* cierre: una invitación, al grano */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h2 className="text-[clamp(2.1rem,6vw,5.5rem)] leading-[0.9] lg:col-span-7">
            <MaskedLine>
              <span className="display">Lleva el sabor</span>
            </MaskedLine>
            <MaskedLine delay={0.08}>
              <span className="display">único del Huila</span>
            </MaskedLine>
            <MaskedLine delay={0.16}>
              <span className="display text-rust">a tu mesa.</span>
            </MaskedLine>
          </h2>

          <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-sm text-lg leading-relaxed text-ink/70">
              Un café de origen, recién tostado y seleccionado con precisión para
              convertir cada taza en un momento único.
            </p>
            {/* una sola acción principal: dos botones juntos confunden */}
            <div className="mt-8">
              <button
                onClick={() => abrirPedido()}
                data-cta
                className="press group flex w-full items-center justify-between gap-3 rounded-full bg-rust py-3.5 pl-6 pr-3.5 text-cream transition hover:bg-ink sm:inline-flex sm:w-auto sm:justify-start"
              >
                <span className="micro">Comprar ahora</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink transition-transform group-hover:translate-x-0.5">
                  <ArrowIcon className="h-4 w-4" />
                </span>
              </button>
            </div>
          </Reveal>
        </div>

        {/* mapa del sitio: cuatro columnas cortas */}
        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-ink/12 pt-10 lg:grid-cols-12 lg:gap-10">
          <div className="col-span-2 lg:col-span-4">
            <Image
              src="/images/logo-cafe-laurel-negro.png"
              alt="Café Laurel"
              width={760}
              height={307}
              className="w-36 sm:w-40"
            />
            <p className="mt-5 max-w-[16rem] text-sm leading-relaxed text-ink/55">
              Café de origen · Finca Pedregal, La Plata, Huila.
            </p>
          </div>

          <Columna titulo="La marca" className="lg:col-span-2 lg:col-start-6">
            {SECCIONES.map((s) => (
              <Enlace key={s.id} onClick={() => goTo(s.id)}>
                {s.label}
              </Enlace>
            ))}
          </Columna>

          <Columna titulo="Compra" className="lg:col-span-2">
            <Enlace onClick={() => abrirPedido()}>Comprar ahora</Enlace>
            <Enlace onClick={() => abrirPedido({ mayorista: true })}>Al por mayor</Enlace>
          </Columna>

          <Columna titulo="Contacto" className="col-span-2 sm:col-span-1 lg:col-span-3">
            {/* los dos contactos con el mismo estilo: píldora de borde fino, minimalista */}
            <ContactoPildora
              href={waLink("Hola, quiero saber más del mejor café del Huila: ¡Café Laurel!")}
              icono={<WhatsAppIcon className="h-5 w-5" />}
            >
              WhatsApp · {WHATSAPP_VISIBLE}
            </ContactoPildora>
            <ContactoPildora href={INSTAGRAM_URL} icono={<InstagramIcon className="h-5 w-5" />}>
              @{INSTAGRAM}
            </ContactoPildora>
          </Columna>
        </div>

        {/* línea final */}
        <div className="mt-14 flex flex-col gap-3 border-t border-ink/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="micro text-ink/40">© 2026 Café Laurel · Cultivado por manos colombianas</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="micro -my-3.5 self-start py-3.5 text-ink/50 transition-colors hover:text-ink sm:self-auto"
          >
            Volver arriba ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

function ContactoPildora({ href, icono, children }: { href: string; icono: ReactNode; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="press group mb-2.5 flex min-h-12 w-full items-center gap-3 rounded-full border border-ink/15 px-5 text-[0.9375rem] font-medium transition hover:border-rust sm:w-auto"
    >
      <span className="text-rust">{icono}</span>
      {children}
    </a>
  );
}

function Columna({ titulo, className, children }: { titulo: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <p className="micro text-ink/40">{titulo}</p>
      {/* en celular cada enlace mide 44px de alto (área de toque cómoda); en escritorio, lista compacta */}
      <div className="mt-2 flex flex-col items-start lg:mt-4 lg:gap-2.5">{children}</div>
    </div>
  );
}

function Enlace({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} className="min-h-11 text-left text-[0.9375rem] transition-colors hover:text-rust lg:min-h-0">
      {children}
    </button>
  );
}
