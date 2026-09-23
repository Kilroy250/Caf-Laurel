import Image from "next/image";
import { MaskedLine, Reveal } from "@/components/motion/Primitives";

export function Contacto() {
  return (
    <footer id="contacto" className="bg-cream text-ink">
      <div className="px-6 pb-10 pt-24 sm:px-10 md:pt-32">
        <h2 className="text-[clamp(2.4rem,8vw,7.5rem)] leading-[0.88]">
          <MaskedLine>
            <span className="display">La corona</span>
          </MaskedLine>
          <MaskedLine delay={0.08}>
            <span className="display">al productor,</span>
          </MaskedLine>
          <MaskedLine delay={0.16}>
            <span className="display-serif text-rust">grandeza para ti.</span>
          </MaskedLine>
        </h2>

        <div className="mt-16 grid gap-10 border-t border-ink/12 pt-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="micro text-ink/40">Pedidos y mayoristas</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/573502725600"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full bg-ink py-3.5 pl-6 pr-3.5 text-cream transition-colors hover:bg-rust"
                >
                  <span className="micro">350 272 5600</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
                <a
                  href="https://instagram.com/cafelaurel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-ink/20 px-6 py-3.5 transition-colors hover:border-ink"
                >
                  <span className="micro">@cafelaurel</span>
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <Reveal delay={0.08}>
              <p className="micro text-ink/40">Origen</p>
              <p className="mt-4 text-lg leading-snug">
                Finca Pedregal
                <br />
                La Plata, Huila
                <br />
                1.900 m s. n. m.
              </p>
            </Reveal>
          </div>

          <div className="flex items-start lg:col-span-3 lg:col-start-10 lg:justify-end">
            <Reveal delay={0.14}>
              <Image
                src="/images/logo-cafe-laurel-negro.png"
                alt="Café Laurel"
                width={760}
                height={307}
                className="w-40 opacity-90"
              />
            </Reveal>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-2 border-t border-ink/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="micro text-ink/35">Cultivado por manos colombianas</p>
          <p className="micro text-ink/35">© 2026 Café Laurel</p>
        </div>
      </div>
    </footer>
  );
}
