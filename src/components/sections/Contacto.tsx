"use client";

import Image from "next/image";
import { MaskedLine, Reveal, Stagger, StaggerItem } from "@/components/motion/Primitives";
import { abrirPedido } from "@/components/sections/NuestroCafe";
import { ArrowIcon, InstagramIcon, WhatsAppIcon } from "@/components/Icons";
import { INSTAGRAM, INSTAGRAM_URL, WHATSAPP_VISIBLE, waLink } from "@/lib/contacto";

export function Contacto() {
  return (
    <footer id="contacto" className="bg-cream text-ink">
      <div className="px-6 pb-10 pt-24 sm:px-10 md:pt-32">
        {/* cierre: una sola invitación clara */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="micro text-rust">Pedidos</p>
            <h2 className="mt-6 text-[clamp(2.6rem,8vw,7rem)] leading-[0.88]">
              <MaskedLine>
                <span className="display">Tu café,</span>
              </MaskedLine>
              <MaskedLine delay={0.08}>
                <span className="display-script text-rust">a un mensaje.</span>
              </MaskedLine>
            </h2>
          </div>

          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-sm text-lg leading-relaxed text-ink/70">
              Escríbenos por WhatsApp: armamos tu pedido contigo y coordinamos el
              envío.
            </p>
            <a
              href={waLink("Hola, quiero pedir Café Laurel.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ink py-3.5 pl-5 pr-3.5 text-cream transition-colors hover:bg-rust"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span className="micro">Escribir por WhatsApp</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink transition-transform group-hover:translate-x-0.5">
                <ArrowIcon className="h-4 w-4" />
              </span>
            </a>
          </Reveal>
        </div>

        {/* tres caminos: comprar, comprar al por mayor, seguirnos */}
        <Stagger className="mt-20 grid border-t border-ink/12 md:grid-cols-3" delay={0.05}>
          <FooterCard
            label="Para tu casa"
            text="Bolsas de 250 g y 500 g, en grano o molido."
            action={
              <FooterAction onClick={() => abrirPedido()}>Arma tu pedido</FooterAction>
            }
          />
          <FooterCard
            label="Mayoristas"
            text="Precios por volumen, desde 10 unidades."
            action={
              <FooterAction onClick={() => abrirPedido({ mayorista: true })}>
                Ver precio al por mayor
              </FooterAction>
            }
          />
          <FooterCard
            label="Contacto"
            text={null}
            action={
              <div className="space-y-3">
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-rust"
                >
                  <WhatsAppIcon className="h-5 w-5 shrink-0 text-rust" />
                  {WHATSAPP_VISIBLE}
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-rust"
                >
                  <InstagramIcon className="h-5 w-5 shrink-0 text-rust" />@{INSTAGRAM}
                </a>
              </div>
            }
          />
        </Stagger>

        {/* firma */}
        <div className="mt-20 flex flex-col gap-8 border-t border-ink/12 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <Image
            src="/images/logo-cafe-laurel-negro.png"
            alt="Café Laurel"
            width={760}
            height={307}
            className="w-36 sm:w-44"
          />
          <div className="flex flex-col gap-2 sm:items-end">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="micro self-start text-ink/50 transition-colors hover:text-ink sm:self-end"
            >
              Volver arriba ↑
            </button>
            <p className="micro text-ink/35">Cultivado por manos colombianas</p>
            <p className="micro text-ink/35">© 2026 Café Laurel</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCard({
  label,
  text,
  action,
}: {
  label: string;
  text: string | null;
  action: React.ReactNode;
}) {
  return (
    <StaggerItem className="flex flex-col border-b border-ink/12 py-8 md:border-b-0 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0">
      <p className="micro text-ink/40">{label}</p>
      {text && <p className="mt-4 max-w-xs text-lg leading-snug">{text}</p>}
      <div className="mt-6">{action}</div>
    </StaggerItem>
  );
}

function FooterAction({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-2 border-b border-ink/25 pb-1 text-base font-semibold transition-colors hover:border-rust hover:text-rust"
    >
      {children}
      <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
