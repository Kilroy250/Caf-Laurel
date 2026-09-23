import Image from "next/image";
import { Reveal } from "@/components/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Cosecha selectiva",
    subtitle: "Solo cerezas maduras",
    text: "Se recolectan a mano únicamente las cerezas de rojo intenso: el punto ideal de azúcares naturales y una base limpia desde el origen.",
    image: "/images/cerezas-cafe-maduras-1.jpg",
    alt: "Cerezas maduras de rojo intenso",
  },
  {
    n: "02",
    title: "Despulpado",
    subtitle: "El grano se libera",
    text: "Se retira la cáscara de la cereza para evitar fermentaciones no deseadas y preparar el grano para la siguiente etapa.",
  },
  {
    n: "03",
    title: "Fermentación controlada",
    subtitle: "De 12 a 24 horas",
    text: "En tanques, según la temperatura y el clima, el grano desarrolla su carácter: su acidez brillante y su complejidad aromática.",
  },
  {
    n: "04",
    title: "Lavado",
    subtitle: "Una taza transparente",
    text: "Con agua limpia se eliminan todos los residuos hasta obtener un pergamino limpio, que garantiza una taza definida y sin notas indeseadas.",
  },
  {
    n: "05",
    title: "Secado al sol",
    subtitle: "Lento y uniforme",
    text: "En paseras, con ventilación natural, hasta alcanzar una humedad del 10–12%. Este secado estabiliza el grano y conserva su calidad.",
    image: "/images/cafe-secado-al-sol-paseras.jpg",
    alt: "Café secándose al sol en paseras",
  },
];

export function Proceso() {
  return (
    <section id="proceso" className="bg-ink px-6 py-24 text-cream sm:px-8 md:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">
            Del árbol a tu taza
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Un proceso sin atajos.
          </h2>
          <p className="mt-4 text-lg text-cream/70">
            Así se hace el café en la Finca Pedregal.
          </p>
        </Reveal>

        <div className="relative mt-16 border-l-2 border-cream/15 pl-8 sm:pl-12">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={0.05} className="relative mb-16 last:mb-0">
              <span className="absolute -left-[calc(2rem+7px)] top-1.5 h-3 w-3 rounded-full bg-gold sm:-left-[calc(3rem+7px)]" />
              <p className="text-xs uppercase tracking-[0.2em] text-gold">
                {step.n} · {step.subtitle}
              </p>
              <h3 className="mt-2 text-2xl font-bold sm:text-3xl">{step.title}</h3>
              <p className="mt-3 max-w-lg text-cream/75">{step.text}</p>

              {step.image && (
                <div className="mt-6 overflow-hidden rounded-2xl">
                  <Image
                    src={step.image}
                    alt={step.alt ?? step.title}
                    width={900}
                    height={600}
                    className="w-full object-cover"
                  />
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
