import { Experience } from "@/components/Experience";
import { Hero } from "@/components/sections/Hero";
import { NuestroCafe } from "@/components/sections/NuestroCafe";
import { Corona } from "@/components/sections/Corona";
import { Origen } from "@/components/sections/Origen";
import { Proceso } from "@/components/sections/Proceso";
import { Contacto } from "@/components/sections/Contacto";

export default function Home() {
  return (
    <Experience>
      <main>
        <Hero />
        <NuestroCafe />
        <Origen />
        <Corona />
        <Proceso />
      </main>
      <Contacto />
    </Experience>
  );
}
