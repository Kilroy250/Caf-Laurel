import { MaskedLine, MaskedWords, Reveal } from "@/components/motion/Primitives";
import { SectionHead } from "@/components/SectionHead";

export function PorQueExistimos() {
  return (
    <section id="por-que-existimos" className="bg-cream text-ink">
      <div className="px-6 pb-20 pt-20 sm:px-10 md:pb-28 md:pt-28">
        <SectionHead n="02" label="Por qué existimos" tone="light" />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <h2 className="text-[clamp(2.4rem,7vw,6.5rem)] leading-[0.9] lg:col-span-7">
            <MaskedLine>
              <span className="display">La corona</span>
            </MaskedLine>
            <MaskedLine delay={0.08}>
              <span className="display">de laurel,</span>
            </MaskedLine>
            <MaskedLine delay={0.16}>
              <span className="display-script text-rust">del campesino.</span>
            </MaskedLine>
          </h2>

          <div className="lg:col-span-4 lg:col-start-9 lg:pt-6">
            <Reveal delay={0.2}>
              <p className="text-lg leading-relaxed text-ink/75">
                Quien cultiva uno de los mejores cafés del mundo casi nunca
                recibe el crédito. Café Laurel nace para conmemorarlo y
                agradecerle: por su grandeza, por el esfuerzo con que se empeña
                en traernos un café de esta calidad.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* banda a sangre — el momento más fuerte de la página */}
      <div className="bg-rust px-6 py-20 text-cream sm:px-10 md:py-28">
        <div className="grid gap-8 lg:grid-cols-12">
          <p className="micro self-start text-cream/60 lg:col-span-2">La promesa</p>
          <blockquote className="text-[clamp(1.9rem,4.6vw,4rem)] leading-[1.02] lg:col-span-9">
            <MaskedWords
              text="Ese café solía viajar lejos, porque afuera pagan más."
              className="display-script block"
              stagger={0.04}
            />
            <span className="mt-6 block">
              <MaskedWords
                text="Laurel existe para devolvértelo."
                className="display block"
                delay={0.3}
              />
            </span>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
