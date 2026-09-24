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
      <div className="relative mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-14 px-6 sm:px-10 lg:grid-cols-12 lg:gap-8">
        {/* izquierda — el logotipo aterriza aquí desde la intro; su lugar no se anima */}
        <div className="order-2 lg:order-1 lg:col-span-3">
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

        {/* centro — el producto: llena el alto libre entre la barra y el borde inferior */}
        <motion.div
          style={{ ...bag, scale: bagScale }}
          className="order-1 flex justify-center lg:order-2 lg:col-span-6"
        >
          <Parallax distance={18}>
            {/* --h = alto de la bolsa; tope por alto de pantalla y por el ancho disponible (0.7787 = ancho/alto) */}
            <div
              className="relative [--h:min(58svh,32rem,calc((100vw-3rem)/0.7787))] lg:[--h:min(calc(100svh-8rem),52rem,calc(64vw-4.5rem))]"
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

        {/* derecha — la esencia */}
        <motion.div style={essence} className="order-3 lg:col-span-3">
          <p className="micro text-rust">La marca</p>

          <p className="mt-5 max-w-sm text-base leading-relaxed text-ink/75">
            Café Laurel nace en la Finca Pedregal, en las montañas de La Plata,
            Huila. Un solo origen, una sola familia. Existe para que el mejor
            café de Colombia por fin se quede en Colombia, y para coronar a
            quien lo cultiva.
          </p>

          <div className="mt-8 h-px w-full bg-ink/12" />

          <div className="mt-4 flex items-baseline justify-between">
            <span className="micro text-ink/40">Altura</span>
            <span className="text-base font-semibold">1.900 m s. n. m.</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="micro text-ink/40">Notas</span>
            <span className="text-base font-semibold">Caramelo · Vainilla</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
