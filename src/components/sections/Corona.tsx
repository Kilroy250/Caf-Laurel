import { MaskedLine, Reveal } from "@/components/motion/Primitives";
import { ScrollExpandImage } from "@/components/motion/ScrollExpandImage";
import { SectionHead } from "@/components/SectionHead";

export function Corona() {
  return (
    <section id="corona" className="bg-ink text-cream">
      <div className="px-6 pt-20 sm:px-10 md:pt-28">
        <SectionHead n="04" label="Quienes lo cultivan" tone="dark" />
      </div>

      <ScrollExpandImage
        src="/images/familia-ceballos-finca-pedregal.jpg"
        alt="Laura y José Enrique Ceballos con su familia en la Finca Pedregal"
        leftWord="Los que"
        rightWord="sostienen"
        caption="La corona de laurel"
      />

      <div className="px-6 pb-24 pt-20 sm:px-10 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <h2 className="text-[clamp(2rem,5vw,4.2rem)] leading-[0.95] lg:col-span-6">
            <MaskedLine>
              <span className="display">Con manos</span>
            </MaskedLine>
            <MaskedLine delay={0.08}>
              <span className="display-script text-rust">humildes.</span>
            </MaskedLine>
          </h2>

          <div className="space-y-6 lg:col-span-5 lg:col-start-8">
            <Reveal>
              <p className="text-lg leading-relaxed text-cream/75">
                Ellos sostienen la corona de laureles que les pertenece. La
                grandeza de este café nace de la grandeza de quienes lo producen.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-cream/75">
                Laura Ceballos y José Enrique Ceballos cultivan este café en la
                Finca Pedregal con amor, esfuerzo y dedicación, para darte un café
                que te haga sentir orgulloso de nuestra tierra colombiana.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="micro border-t border-cream/15 pt-6 text-cream/40">
                Laura &amp; José Enrique Ceballos · Finca Pedregal
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
