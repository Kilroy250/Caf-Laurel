import { Intro } from "@/components/Intro";
import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/sections/Hero";
import { NuestroCafe } from "@/components/sections/NuestroCafe";
import { PorQueExistimos } from "@/components/sections/PorQueExistimos";
import { Corona } from "@/components/sections/Corona";
import { Origen } from "@/components/sections/Origen";
import { Proceso } from "@/components/sections/Proceso";
import { Contacto } from "@/components/sections/Contacto";

export default function Home() {
  return (
    <>
      <Intro />
      <SiteNav />
      <main>
        <Hero />
        <NuestroCafe />
        <PorQueExistimos />
        <Corona />
        <Origen />
        <Proceso />
      </main>
      <Contacto />
    </>
  );
}
