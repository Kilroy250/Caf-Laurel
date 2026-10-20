"use client";

import Image from "next/image";
import { useRef } from "react";
import { type MotionValue, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Parallax, useScrollLinked } from "@/components/motion/Primitives";
import { abrirPedido } from "@/components/Pedido";
import { ArrowIcon } from "@/components/Icons";
import { INTRO_DONE, useIntro } from "@/components/intro-context";
import { VERTICAL_QUERY, useMediaQuery } from "@/components/useMediaQuery";

// grano-campesino-sombra.webp: el grano mide 700 × 974 px y la imagen trae la
// sombra horneada alrededor (864 × 1184; margen 82 px a los lados y arriba).
// La caja del grano usa su proporción (700/974 = 0.7187); la imagen se sale de
// ella exactamente lo que mide la sombra. Si se cambia la foto, rehacer estas cifras.
const GRANO_W = 700;
const GRANO_H = 974;
const SOMBRA = { left: "-11.714%", top: "-8.419%", width: "123.429%", height: "121.561%" };

/** Aparición ligada al tramo [from, to] del progreso de la intro. */
function useIntroReveal(progress: MotionValue<number>, from: number, to: number, rise: number) {
  const opacity = useTransform(progress, [from, to], [0, 1]);
  const y = useTransform(progress, [from, to], [rise, 0]);
  return { opacity, y };
}

export function Hero() {
  const { phase, progress, heroLogoRef } = useIntro();
  const reduce = useReducedMotion();
  // celular vertical: el logo vuela hacia arriba, así que el grano aparece al final,
  // cuando el logo ya pasó por su lugar (nada se cruza)
  const vertical = useMediaQuery(VERTICAL_QUERY);
  const [granoDesde, granoHasta] = vertical ? [0.7, INTRO_DONE] : [0.2, 0.86];

  // el grano sube desde abajo, se endereza y se centra mientras el campesino despeja el centro
  const grano = useIntroReveal(progress, granoDesde, granoHasta, 180);
  const granoScale = useTransform(progress, [granoDesde, granoHasta], [0.78, 1]);
  const granoRotate = useTransform(progress, [granoDesde, granoHasta], [-16, 0]);

  // celular: el grano sigue una copia suavizada (resorte) de su tramo, así termina
  // frenando despacio en vez de detenerse de golpe
  const tramoGrano = useTransform(progress, [granoDesde, granoHasta], [0, 1]);
  const suave = useSpring(tramoGrano, vertical ? { stiffness: 60, damping: 18, mass: 1 } : { stiffness: 80, damping: 19, mass: 1 });
  const granoMovil = {
    opacity: useTransform(suave, [0, 0.6], [0, 1]),
    y: useTransform(suave, [0, 1], [180, 0]),
    scale: useTransform(suave, [0, 1], [0.78, 1]),
    rotate: useTransform(suave, [0, 1], [-16, 0]),
  };

  // salida: al bajar a la siguiente sección el grano sube, se encoge y se desvanece
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: salida } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const salidaY = useTransform(salida, [0, 0.8], ["0vh", "-22vh"]);
  const salidaScale = useTransform(salida, [0, 0.8], [1, 0.86]);
  const salidaOpacity = useScrollLinked(salida, [0.05, 0.6], [1, 0]);
  const cueOpacity = useScrollLinked(salida, [0, 0.1], [1, 0]);
  const essence = useIntroReveal(progress, 0.55, 0.9, 22);
  const actions = useIntroReveal(progress, 0.62, INTRO_DONE, 18);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative flex min-h-svh items-center overflow-hidden bg-cream pb-12 pt-20 text-ink sm:pb-16 sm:pt-24 lg:pb-6 bajo:pb-10 bajo:pt-20 vertical:min-h-[calc(100svh+6rem)] vertical:pb-[9rem] pin:snap-start"
    >
      {/* --h = alto del grano: en escritorio el 56 % del alto de pantalla; tope por el ancho disponible (0.7187 = ancho/alto).
          Celular vertical: marca arriba, el grano al centro y la acción debajo (bloque "contents": sus piezas se ordenan sueltas). */}
      <div className="relative mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-8 px-6 [--h:min(46svh,26rem,calc((100vw-3rem)/0.7187))] sm:gap-14 sm:px-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-10 lg:[--h:min(56svh,36rem,calc(56vw-4.5rem))] bajo:grid-cols-2 bajo:gap-x-10 bajo:gap-y-12 bajo:[--h:min(70svh,22rem)] vertical:gap-0 vertical:justify-items-center vertical:[--h:min(36svh,20rem,calc((100vw-3rem)/0.7187))]">
        {/* derecha — el logotipo aterriza aquí desde la intro; su lugar no se anima.
            Centrado en su columna, igual que el párrafo en la suya. */}
        <div className="order-2 flex flex-col items-center text-center lg:order-3 vertical:contents">
          <div
            ref={heroLogoRef}
            className="w-full max-w-[15rem] lg:max-w-[17rem] vertical:order-1 vertical:max-w-[13.5rem]"
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

          <motion.div style={actions} className="flex flex-col items-center vertical:order-2">
            <p className="micro mt-5 text-ink/40 sm:mt-6 vertical:mt-3">Finca Pedregal · La Plata, Huila</p>
          </motion.div>

          <motion.div style={actions} className="flex flex-col items-center vertical:order-4">
            <button
              onClick={() => abrirPedido()}
              data-cta
              className="press group mt-6 inline-flex items-center gap-3 rounded-full bg-rust py-3.5 pl-6 pr-3.5 text-cream transition hover:bg-ink sm:mt-8 vertical:mt-10"
            >
              <span className="micro">Comprar ahora</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink transition-transform group-hover:translate-x-0.5">
                <ArrowIcon className="h-4 w-4" />
              </span>
            </button>
          </motion.div>
        </div>

        {/* centro — el grano con el campesino quemado, flotando */}
        <motion.div
          style={!reduce ? granoMovil : { ...grano, scale: granoScale, rotate: granoRotate }}
          className="order-1 flex justify-center lg:order-2 vertical:order-3 vertical:mt-8"
        >
          <motion.div style={reduce ? undefined : { y: salidaY, scale: salidaScale, opacity: salidaOpacity }}>
          <Parallax distance={18}>
            <div className="relative" style={{ height: "var(--h)", width: `calc(var(--h) * ${GRANO_W} / ${GRANO_H})` }}>
              {/* sombra en el piso: se encoge cuando el grano sube. Degradado, no filtro: los
                  filtros (blur, drop-shadow) Safari de iPhone a veces los dibuja como rectángulos */}
              <motion.div
                aria-hidden
                className="absolute -bottom-[8%] left-1/2 h-[9%] w-[78%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(18,16,9,0.22),rgba(18,16,9,0))]"
                animate={
                  reduce
                    ? undefined
                    : vertical
                      ? { scaleX: [1, 0.8, 1], opacity: [0.9, 0.5, 0.9] }
                      : { scaleX: [1, 0.86, 1], opacity: [0.9, 0.6, 0.9] }
                }
                transition={{ duration: vertical ? 5.5 : 6, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* flote continuo, muy lento */}
              <motion.div
                className="absolute inset-0"
                animate={
                  reduce
                    ? undefined
                    : vertical
                      ? { y: [0, -22, 0], rotate: [-1.5, 2.5, -1.5] } // celular: un poco más visible
                      : { y: [0, -14, 0], rotate: [0, 1.5, 0] }
                }
                transition={{ duration: vertical ? 5.5 : 6, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* la imagen trae la sombra horneada: se sale de la caja del grano lo que mide la sombra */}
                <div className="absolute" style={SOMBRA}>
                  <Image
                    src="/images/grano-campesino-sombra.webp"
                    alt="Grano de café tostado con el campesino de Café Laurel grabado"
                    fill
                    priority
                    sizes="(max-width: 1024px) 60vw, 32vw"
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </div>
          </Parallax>
          </motion.div>
        </motion.div>

        {/* izquierda — la esencia, centrada en su columna */}
        <motion.div style={vertical ? { opacity: essence.opacity } : essence} className="order-3 flex justify-center lg:order-1 bajo:col-span-2 vertical:order-5 vertical:mt-8 vertical:[@media(max-height:704px)]:mt-2.5">
          <p className="texto-cuento max-w-[28rem] text-center text-[1.1875rem] leading-[1.5] text-ink vertical:max-w-none vertical:text-[0.96875rem] vertical:leading-[1.45] vertical:[@media(max-height:704px)]:text-[0.875rem] vertical:[@media(max-height:704px)]:leading-[1.4] text-balance lg:text-pretty lg:text-[1.0625rem] xl:text-[1.1875rem]">
            Creemos que la <em className="enfasis">grandeza</em> no llega con el viento:{" "}
            <em className="enfasis">se cultiva.</em> Al honrar el temple y la dedicación
            del campesino, le entregamos la corona de laurel.
          </p>
        </motion.div>
      </div>

      {/* señal de que hay más abajo: celular vertical y computador (debajo del grano), sutil,
          y se va al empezar a deslizar */}
      <motion.div
        aria-hidden
        style={{ opacity: cueOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-[6.25rem] hidden justify-center vertical:flex lg:bottom-[4svh] lg:flex"
      >
        <motion.div style={{ opacity: essence.opacity }}>
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-ink/45"
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
