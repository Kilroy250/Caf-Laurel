import Image from "next/image";
import { Reveal } from "@/components/Reveal";

export function Origen() {
  return (
    <section id="origen" className="relative overflow-hidden bg-ink px-6 py-24 text-cream sm:px-8 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">
            El origen · Finca Pedregal
          </p>
          <h2 className="mt-4 font-serif-italic text-5xl text-white sm:text-6xl">
            1.900 m.s.n.m
          </h2>
          <p className="mt-6 max-w-md text-lg text-cream/80">
            En las montañas de La Plata, al sur del Huila, está la Finca Pedregal.
            Es pequeña — apenas un par de hectáreas sembradas en café — y es de
            Laura y José Enrique Ceballos.
          </p>
          <p className="mt-4 max-w-md text-lg text-cream/80">
            A esta altura el café madura despacio: más tiempo en la mata, más
            dulzor, más cuerpo y una acidez limpia y brillante. Y el clima del
            Huila permite algo que pocas regiones de Colombia pueden hacer: secar
            el grano al sol, sin prisa.
          </p>
          <p className="mt-6 max-w-md border-l-2 border-gold pl-4 text-base font-medium text-white">
            Conocemos su tierra, su proceso y su nombre. Por eso podemos responder
            por cada grano.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mx-auto max-w-sm">
            <Image
              src="/images/ilustracion-montana-cosechero.jpg"
              alt="Ilustración del cosechero caminando en la montaña"
              width={1100}
              height={1100}
              className="w-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
