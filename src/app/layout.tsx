import type { Metadata } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Café Laurel — La grandeza se cultiva",
  description:
    "Café de altura de la Finca Pedregal, La Plata, Huila. Cultivado a 1.900 m s. n. m. por Laura y José Enrique Ceballos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${archivo.variable} ${instrument.variable}`}>
      <body className="bg-ink text-cream">{children}</body>
    </html>
  );
}
