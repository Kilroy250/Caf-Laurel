import { Intro } from "@/components/Intro";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { PorQueExistimos } from "@/components/sections/PorQueExistimos";
import { CoronaDeLaurel } from "@/components/sections/CoronaDeLaurel";
import { Origen } from "@/components/sections/Origen";
import { NuestroCafe } from "@/components/sections/NuestroCafe";
import { Proceso } from "@/components/sections/Proceso";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Intro />
      <Nav />
      <main>
        <Hero />
        <PorQueExistimos />
        <CoronaDeLaurel />
        <Origen />
        <NuestroCafe />
        <Proceso />
      </main>
      <Footer />
    </>
  );
}
