import type { Metadata } from "next";
import { Archivo, Fraunces } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Café Laurel — La grandeza se cultiva",
  description:
    "Café de la Finca Pedregal, La Plata, Huila. Cultivado por Laura y José Enrique Ceballos a 1.900 m.s.n.m.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${archivo.variable} ${fraunces.variable}`}>
      <body className="bg-cream text-ink antialiased">{children}</body>
    </html>
  );
}
