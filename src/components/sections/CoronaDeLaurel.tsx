import Image from "next/image";
import { Reveal } from "@/components/Reveal";

export function CoronaDeLaurel() {
  return (
    <section id="corona-laurel" className="bg-cream px-6 py-24 sm:px-8 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <Reveal className="order-2 md:order-1">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">
            Quienes lo cultivan
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            Los que sostienen la corona de laurel.
          </h2>
          <p className="mt-6 max-w-md text-lg text-ink/80">
            Con manos humildes, ellos sostienen la corona de laureles que les
            pertenece. La grandeza de este café nace de la grandeza de quienes lo
            producen.
          </p>
          <p className="mt-4 max-w-md text-lg text-ink/80">
            Laura Ceballos y José Enrique Ceballos, con amor, esfuerzo, dedicación y
            fuerza, cultivan este café en la Finca Pedregal y hacen todo lo posible
            para darte un café que te haga sentir orgulloso de nuestra tierra
            colombiana.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-ink/50">
            Laura &amp; José Enrique Ceballos · Finca Pedregal
          </p>
        </Reveal>

        <Reveal delay={0.15} className="order-1 md:order-2">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/images/familia-ceballos-finca-pedregal.jpg"
              alt="Laura y José Enrique Ceballos junto a su familia en la Finca Pedregal"
              width={720}
              height={569}
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
