import { ScrollExpandImage } from "@/components/motion/ScrollExpandImage";
import { SectionHead } from "@/components/SectionHead";

export function Corona() {
  return (
    <section id="corona" className="bg-ink text-cream">
      <div className="px-6 pt-20 sm:px-10 md:pt-28">
        <SectionHead n="03" label="Quienes lo cultivan" tone="dark" />
      </div>

      <ScrollExpandImage
        src="/images/familia-ceballos-finca-pedregal.jpg"
        alt="Laura y José Enrique Ceballos con su familia en la Finca Pedregal"
        leftWord="Los que"
        rightWord="sostienen"
        caption="La corona de laurel"
      >
        {/* cuadro final: quiénes son, qué representan y qué significa la corona */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-6">
            <p className="micro text-cream/60">Laura &amp; José Enrique Ceballos · Finca Pedregal</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,6vw,5rem)] text-cream">
              La corona
              <br />
              es de ellos.
            </h2>
          </div>

          <div className="space-y-4 text-base leading-relaxed text-cream/80 md:text-lg lg:col-span-5 lg:col-start-8">
            <p>
              Quien cultiva uno de los mejores cafés del mundo casi nunca recibe
              el crédito. Café Laurel nace para conmemorarlo y agradecerle: la
              corona de laurel, símbolo de victoria, le pertenece.
            </p>
            <p>
              Laura y José Enrique Ceballos cultivan este café con amor, esfuerzo
              y dedicación. La grandeza de este café nace de la grandeza de
              quienes lo producen.
            </p>
          </div>
        </div>
      </ScrollExpandImage>
    </section>
  );
}
