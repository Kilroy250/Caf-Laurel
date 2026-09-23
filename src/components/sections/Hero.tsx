"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EASE_OUT_EXPO, Parallax } from "@/components/motion/Primitives";
import { goTo } from "@/components/SiteNav";
import { useEntered } from "@/components/Experience";

export function Hero() {
  const entered = useEntered();

  // los elementos entran cuando la intro cede el paso, no al montar
  const ENTRA = {
    initial: { opacity: 0, y: 18 },
    animate: entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
  };

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden bg-cream pt-28 pb-16 text-ink"
    >
      <div className="relative mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-14 px-6 sm:px-10 lg:grid-cols-12 lg:gap-8">
        {/* izquierda — identidad */}
        <motion.div
          {...ENTRA}
          transition={{ delay: 0.5, duration: 0.9, ease: EASE_OUT_EXPO }}
          className="order-2 lg:order-1 lg:col-span-3"
        >
          <Image
            src="/images/logo-cafe-laurel-negro.png"
            alt="Café Laurel"
            width={760}
            height={307}
            priority
            className="w-full max-w-[15rem] lg:max-w-[17rem]"
          />

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

        {/* centro — el producto */}
        <motion.div
          {...ENTRA}
          transition={{ delay: 0.15, duration: 1.1, ease: EASE_OUT_EXPO }}
          className="order-1 flex justify-center lg:order-2 lg:col-span-6"
        >
          <Parallax distance={18}>
            <div className="relative aspect-[3/4] w-[min(72vw,26rem)]">
              <Image
                src="/images/producto-bolsa-cafe-fondo-claro.jpg"
                alt="Bolsa de Café Laurel — Huila, Finca Pedregal"
                fill
                priority
                sizes="(max-width: 1024px) 72vw, 26rem"
                className="object-cover"
              />
            </div>
          </Parallax>
        </motion.div>

        {/* derecha — la esencia */}
        <motion.div
          {...ENTRA}
          transition={{ delay: 0.62, duration: 0.9, ease: EASE_OUT_EXPO }}
          className="order-3 lg:col-span-3"
        >
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
