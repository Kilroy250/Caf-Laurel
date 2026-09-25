import { MaskedLine, Reveal } from "@/components/motion/Primitives";
import { ImageSlot } from "@/components/motion/ImageSlot";
import { SectionHead } from "@/components/SectionHead";

const PASOS = [
  {
    n: "01",
    titulo: "Cosecha selectiva",
    clave: "Solo cerezas maduras",
    texto:
      "Se recolectan a mano únicamente las cerezas de rojo intenso: el punto ideal de azúcares naturales y una base limpia desde el origen.",
  },
  {
    n: "02",
    titulo: "Despulpado",
    clave: "El grano se libera",
    texto:
      "Se retira la cáscara de la cereza para evitar fermentaciones no deseadas y preparar el grano para la siguiente etapa.",
  },
  {
    n: "03",
    titulo: "Fermentación",
    clave: "De 12 a 24 horas",
    texto:
      "En tanques, según la temperatura y el clima, el grano desarrolla su carácter: su acidez brillante y su complejidad aromática.",
  },
  {
    n: "04",
    titulo: "Lavado",
    clave: "Una taza transparente",
    texto:
      "Con agua limpia se eliminan todos los residuos hasta obtener un pergamino limpio, que garantiza una taza definida y sin notas indeseadas.",
  },
  {
    n: "05",
    titulo: "Secado al sol",
    clave: "Lento y uniforme",
    texto:
      "En paseras, con ventilación natural, hasta alcanzar una humedad del 10–12 %. Este secado estabiliza el grano y conserva su calidad.",
  },
];

export function Proceso() {
  return (
    <section id="proceso" className="bg-ink text-cream">
      <div className="px-6 pb-24 pt-20 sm:px-10 md:pb-32 md:pt-28">
        <SectionHead n="05" label="Del árbol a tu taza" tone="dark" />

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* columna fija */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.92]">
                <MaskedLine>
                  <span className="display">Un proceso</span>
                </MaskedLine>
                <MaskedLine delay={0.08}>
                  <span className="display-script text-rust">sin atajos.</span>
                </MaskedLine>
              </h2>

              <Reveal delay={0.15}>
                <p className="mt-6 max-w-xs text-lg leading-relaxed text-cream/70">
                  Cinco etapas, todas en la finca. Así se hace el café en
                  Pedregal.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-10 hidden max-w-xs lg:block">
                  <ImageSlot
                    tone="ink"
                    ratio="aspect-[4/5]"
                    note="Primer plano de las manos del recolector sosteniendo cerezas rojas. Un detalle humano, no un paisaje."
                  />
                </div>
              </Reveal>
            </div>
          </div>

          {/* etapas */}
          <ol className="lg:col-span-7 lg:col-start-6">
            {PASOS.map((p, i) => (
              <li key={p.n} className="border-t border-cream/12 py-10 first:border-t-0 first:pt-0">
                <Reveal delay={0.05}>
                  <div className="flex items-baseline gap-5">
                    <span className="display text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-rust">
                      {p.n}
                    </span>
                    <div>
                      <p className="micro text-cream/40">{p.clave}</p>
                      <h3 className="mt-2 text-[clamp(1.5rem,3.2vw,2.5rem)] font-bold leading-tight">
                        {p.titulo}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-5 max-w-lg text-lg leading-relaxed text-cream/70 lg:pl-[calc(clamp(2.5rem,6vw,4.5rem)+1.25rem)]">
                    {p.texto}
                  </p>
                </Reveal>
                {i === PASOS.length - 1 && <span className="sr-only">Fin del proceso</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
