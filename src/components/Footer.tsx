import Image from "next/image";
import { Reveal } from "@/components/Reveal";

export function Footer() {
  return (
    <footer className="bg-ink px-6 pb-10 pt-24 text-center text-cream sm:px-8">
      <Reveal>
        <div className="mx-auto mb-10 max-w-xs overflow-hidden rounded-2xl">
          <Image
            src="/images/producto-bolsa-cafe-fondo-claro.jpg"
            alt="Bolsa de Café Laurel"
            width={900}
            height={1350}
            className="w-full object-cover"
          />
        </div>

        <Image
          src="/images/logo-cafe-laurel-blanco.png"
          alt="Café Laurel"
          width={760}
          height={307}
          className="mx-auto w-48"
        />

        <p className="mx-auto mt-6 max-w-md text-lg font-medium text-cream/85">
          La corona al productor, granos de grandeza para ti.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://wa.me/573502725600"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-ink"
          >
            Escríbenos · 350 272 5600
          </a>
          <a
            href="https://instagram.com/cafelaurel"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-cream/30 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-cream"
          >
            @cafelaurel
          </a>
        </div>
      </Reveal>

      <p className="mt-16 text-xs uppercase tracking-[0.2em] text-cream/40">
        Cultivado por manos colombianas · La Plata, Huila
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cream/40">
        © 2026 Café Laurel · La grandeza se cultiva
      </p>
    </footer>
  );
}
