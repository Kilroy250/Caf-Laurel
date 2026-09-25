"use client";

import Image from "next/image";
import { type MotionValue, motion, useTransform } from "framer-motion";
import { Parallax } from "@/components/motion/Primitives";
import { goTo } from "@/components/SiteNav";
import { INTRO_DONE, useIntro } from "@/components/intro-context";

// producto-bolsa-transparente.webp, recortada al contenido: 883 × 1134 px.
// Si se cambia la foto, hay que actualizar el ancho/alto y el 0.7787 de abajo.
const BAG_WIDTH = 883;
const BAG_HEIGHT = 1134;

/** Aparición ligada al tramo [from, to] del progreso de la intro. */
function useIntroReveal(progress: MotionValue<number>, from: number, to: number, rise: number) {
  const opacity = useTransform(progress, [from, to], [0, 1]);
  const y = useTransform(progress, [from, to], [rise, 0]);
  return { opacity, y };
}

export function Hero() {
  const { phase, progress, heroLogoRef } = useIntro();

  // la bolsa se materializa mientras el campesino sube y le despeja el centro
  const bag = useIntroReveal(progress, 0.24, 0.84, 40);
  const bagScale = useTransform(progress, [0.24, 0.84], [0.94, 1]);
  const essence = useIntroReveal(progress, 0.55, 0.9, 22);
  const actions = useIntroReveal(progress, 0.62, INTRO_DONE, 18);

  return (
    <section
      id="inicio"
      className="relative flex min-h-svh items-center overflow-hidden bg-cream pb-16 pt-24 text-ink lg:pb-6"
    >
      {/* --h = alto de la bolsa: en escritorio el 73 % del alto de pantalla (para bajarla, cambiar ese 73); tope por el ancho disponible (0.7787 = ancho/alto). Vive aquí porque el texto también lo usa */}
      <div className="relative mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-14 px-6 [--h:min(58svh,32rem,calc((100vw-3rem)/0.7787))] sm:px-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-12 lg:[--h:min(73svh,46rem,calc(64vw-4.5rem))]">
        {/* izquierda — el logotipo aterriza aquí desde la intro; su lugar no se anima */}
        <div className="order-2 lg:order-1">
          <div
            ref={heroLogoRef}
            className="w-full max-w-[15rem] lg:max-w-[17rem]"
            style={{ opacity: phase === "intro" ? 0 : 1 }}
          >
            <Image
              src="/images/logo-cafe-laurel-negro.png"
              alt="Café Laurel"
              width={760}
              height={307}
              priority
              className="h-auto w-full"
            />
          </div>

          <motion.div style={actions}>
            <p className="micro mt-6 text-ink/40">Finca Pedregal · La Plata, Huila</p>

            <button
              onClick={() => goTo("nuestro-cafe")}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ink py-3.5 pl-6 pr-3.5 text-cream transition-colors hover:bg-rust"
            >
              <span className="micro">Quiero uno</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </motion.div>
        </div>

        {/* centro — el producto, con aire alrededor */}
        <motion.div
          style={{ ...bag, scale: bagScale }}
          className="order-1 flex justify-center lg:order-2"
        >
          <Parallax distance={18}>
            <div
              className="relative"
              style={{
                height: "var(--h)",
                width: `calc(var(--h) * ${BAG_WIDTH} / ${BAG_HEIGHT})`,
              }}
            >
              <Image
                src="/images/producto-bolsa-transparente.webp"
                alt="Bolsa de Café Laurel, Huila — Finca Pedregal, sobre una base de mármol"
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 45vw"
                className="object-contain drop-shadow-[0_26px_34px_rgba(18,16,9,0.14)]"
              />
            </div>
          </Parallax>
        </motion.div>

        {/* derecha — la esencia. El margen negativo adelanta el texto hasta 2.5rem del borde real de la bolsa: a esa altura la imagen deja libre el 18.8 % de su ancho (0.7787 × 0.188 = 0.1464) */}
        <motion.div style={essence} className="order-3 lg:ml-[calc(-0.5rem-var(--h)*0.1464)]">
          <p className="text-base leading-relaxed text-ink/75 lg:text-pretty lg:text-center lg:text-sm xl:text-[0.9375rem]">
            Creemos que la grandeza no llega con el viento: se cultiva. Al
            conmemorar al campesino y su berraquera, esas fuerzas arraigan en
            nosotros. Por eso le entregamos la corona de laurel: su temple es
            el espejo de nuestra grandeza.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
