import {
  CountUp,
  MaskedLine,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/motion/Primitives";
import Image from "next/image";
import { BeanDrift } from "@/components/motion/BeanDrift";
import { SectionHead } from "@/components/SectionHead";

const DATOS = [
  { label: "Municipio", value: "La Plata" },
  { label: "Departamento", value: "Huila" },
  { label: "Finca", value: "Pedregal" },
  { label: "Extensión", value: "Un par de hectáreas" },
];

export function Origen() {
  return (
    <section id="origen" className="relative overflow-hidden bg-cream text-ink pin:snap-start">
      {/* granos suspendidos detrás del contenido: pasan por detrás de la foto */}
      <BeanDrift />

      {/* un solo encuadre: la altura arriba; debajo, la finca y su foto */}
      <div className="relative px-6 pb-24 pt-20 sm:px-10 md:pt-28 pin:flex pin:h-svh pin:flex-col pin:justify-center pin:pb-10 pin:pt-24">
        <SectionHead n="02" label="El origen" tone="light" />

        {/* la altura como protagonista: cifra y unidad forman un solo bloque */}
        <h2 className="mt-10 flex items-start gap-[0.04em] text-[clamp(4.5rem,18vw,9rem)] pin:mt-6 pin:text-[clamp(5rem,min(15vw,21svh),13rem)]">
          <span className="sr-only">1.900 metros sobre el nivel del mar</span>
          {/* el ancho de "1.900" queda reservado: la unidad no se mueve mientras la cifra cuenta */}
          <span aria-hidden className="display relative leading-[0.78] tabular-nums">
            <span className="invisible">1.900</span>
            <CountUp to={1900} className="absolute inset-0 text-right" />
          </span>
          <span aria-hidden className="pt-[0.06em]">
            <span className="display block text-[0.2em] normal-case leading-none text-rust">m s. n. m.</span>
            <span className="micro mt-3 hidden max-w-[24ch] text-[max(0.6875rem,0.045em)] leading-snug text-ink/45 sm:block">
              Metros sobre el nivel del mar
            </span>
          </span>
        </h2>

        <div className="mt-12 grid gap-12 pin:mt-[min(5svh,3rem)] lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-5">
            <h3 className="text-[clamp(1.6rem,2.8vw,2.5rem)] leading-[0.95]">
              <MaskedLine>
                <span className="display">Más altura,</span>
              </MaskedLine>
              <MaskedLine delay={0.08}>
                <span className="display-script text-rust">más tiempo en la mata.</span>
              </MaskedLine>
            </h3>

            <Reveal delay={0.12}>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink/75">
                En las montañas de La Plata, al sur del Huila, está la Finca
                Pedregal. A 1.900 metros el clima es más fresco y la cereza
                madura despacio en la mata: el grano se forma con calma, más
                denso, y en la taza se siente en una acidez más viva y un aroma
                más intenso.
              </p>
            </Reveal>

            <Stagger className="mt-6" delay={0.1}>
              {DATOS.map((d) => (
                <StaggerItem
                  key={d.label}
                  className="flex items-baseline justify-between border-t border-ink/12 py-2.5"
                >
                  <span className="micro text-ink/40">{d.label}</span>
                  <span className="text-base font-medium">{d.value}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              {/* provisional, hasta tener fotos de la Finca Pedregal: cafetales reales del Huila (Acevedo) */}
              <figure className="relative aspect-[3/2] w-full overflow-hidden bg-cream-deep">
                <Image
                  src="/images/cafetales-acevedo-huila.webp"
                  alt="Montañas cubiertas de cafetales en Acevedo, Huila"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 flex flex-col items-start gap-1 bg-gradient-to-t from-ink/60 to-transparent px-4 pb-3 pt-10 text-[0.6875rem] text-cream/85 sm:flex-row sm:items-end sm:justify-between">
                  <span className="micro">Cafetales del Huila</span>
                  {/* licencia CC BY-SA 4.0: el crédito es obligatorio */}
                  <a
                    href="https://commons.wikimedia.org/wiki/File:Cafetales_de_Acevedo_Huila.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-my-3.5 py-3.5 opacity-80 hover:opacity-100"
                  >
                    Foto: Portal80 · CC BY-SA 4.0
                  </a>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
