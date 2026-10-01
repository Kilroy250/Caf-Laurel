// Un solo lugar para los datos de contacto: si cambia el número, cambia en toda la página.
export const WHATSAPP = "573502725600";
export const WHATSAPP_VISIBLE = "350 272 5600";
export const INSTAGRAM = "cafelaurel";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM}`;

/** Enlace de WhatsApp, opcionalmente con un mensaje ya escrito. */
export function waLink(text?: string) {
  return `https://wa.me/${WHATSAPP}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export const MENSAJE_MAYORISTA = "Hola, quiero información de precios al por mayor de Café Laurel.";
