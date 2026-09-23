import { Reveal } from "@/components/Reveal";

export function PorQueExistimos() {
  return (
    <section id="por-que-existimos" className="bg-cream px-6 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-3xl border-l-2 border-gold pl-6 sm:pl-10">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Por qué existimos</p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            La corona de laurel,
            <br />
            aquí es <span className="font-serif-italic font-normal text-gold">del campesino</span>.
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 max-w-xl text-lg text-ink/80">
            Quien cultiva uno de los mejores cafés del mundo y casi nunca recibe el
            crédito. En Café Laurel nacimos para conmemorarlo y agradecerle — por su
            grandeza, por el esfuerzo con que se empeña en traernos un café de esta
            calidad.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <blockquote className="mt-8 border-l-2 border-ink/20 pl-5 text-lg font-medium text-ink">
            Ese café solía viajar lejos, porque afuera pagan más.{" "}
            <span className="font-bold">
              Laurel existe para devolvértelo, y para coronar a quien lo hace posible.
            </span>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
