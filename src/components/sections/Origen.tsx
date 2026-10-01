import {
  CountUp,
  MaskedLine,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/motion/Primitives";
import { ImageSlot } from "@/components/motion/ImageSlot";
import { SectionHead } from "@/components/SectionHead";

const DATOS = [
  { label: "Municipio", value: "La Plata" },
  { label: "Departamento", value: "Huila" },
  { label: "Finca", value: "Pedregal" },
  { label: "Extensión", value: "Un par de hectáreas" },
];

export function Origen() {
  return (
    <section id="origen" className="bg-cream text-ink">
      <div className="px-6 pb-24 pt-20 sm:px-10 md:pb-32 md:pt-28">
        <SectionHead n="02" label="El origen" tone="light" />

        {/* la altura como protagonista: cifra y unidad forman un solo bloque */}
        <h2 className="mt-14 flex items-start gap-[0.04em] text-[clamp(5rem,21vw,19rem)]">
          <span className="sr-only">1.900 metros sobre el nivel del mar</span>
          {/* el ancho de "1.900" queda reservado: la unidad no se mueve mientras la cifra cuenta */}
          <span aria-hidden className="display relative leading-[0.78] tabular-nums">
            <span className="invisible">1.900</span>
            <CountUp to={1900} className="absolute inset-0 text-right" />
          </span>
          <span aria-hidden className="pt-[0.06em]">
            <span className="display block text-[0.2em] normal-case leading-none text-rust">m s. n. m.</span>
            <span className="micro mt-3 hidden max-w-[24ch] sm:block text-[max(0.6875rem,0.045em)] leading-snug text-ink/45">
              Metros sobre el nivel del mar
            </span>
          </span>
        </h2>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h3 className="text-[clamp(1.8rem,4vw,3rem)] leading-[0.95]">
              <MaskedLine>
                <span className="display">Más altura,</span>
              </MaskedLine>
              <MaskedLine delay={0.08}>
                <span className="display-script text-rust">más tiempo en la mata.</span>
              </MaskedLine>
            </h3>

            <Reveal delay={0.15}>
              <p className="mt-7 max-w-md text-lg leading-relaxed text-ink/75">
                En las montañas de La Plata, al sur del Huila, está la Finca
                Pedregal. A esta altura el café pasa más tiempo en la mata: más
                dulzor, más cuerpo, y una acidez limpia y brillante.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/75">
                El clima del Huila permite algo que pocas regiones de Colombia
                pueden hacer: secar el grano al sol, sin prisa.
              </p>
            </Reveal>

            <Stagger className="mt-10" delay={0.1}>
              {DATOS.map((d) => (
                <StaggerItem
                  key={d.label}
                  className="flex items-baseline justify-between border-t border-ink/12 py-3.5"
                >
                  <span className="micro text-ink/40">{d.label}</span>
                  <span className="text-lg font-medium">{d.value}</span>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.2}>
              <p className="mt-10 max-w-sm border-l-2 border-rust pl-5 text-lg font-medium leading-snug">
                Conocemos su tierra, su proceso y su nombre. Por eso podemos
                responder por cada grano.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <ImageSlot
                tone="rust"
                ratio="aspect-[4/3]"
                note="Panorámica de la Finca Pedregal: la montaña y los cafetales en ladera, tomada de lejos y en horizontal. Es la foto que ancla toda esta sección."
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
