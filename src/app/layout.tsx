import type { Metadata } from "next";
import { Archivo, Sacramento } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

/* Provisional: sustituta gratuita de la manuscrita del logo
   (Adobe Handwriting Ernie) hasta tener su licencia web. */
const script = Sacramento({
  variable: "--font-script-brand",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Café Laurel — La grandeza se cultiva",
  description:
    "Café de altura de la Finca Pedregal, La Plata, Huila. Cultivado a 1.900 m s. n. m. por Laura y José Enrique Ceballos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${archivo.variable} ${script.variable}`}>
      <body className="bg-cream text-ink">{children}</body>
    </html>
  );
}
