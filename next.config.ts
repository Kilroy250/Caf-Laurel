import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Solo afecta al servidor de desarrollo: deja que un celular en la misma red
  // wifi abra la página (http://<ip-del-mac>:3000) para probarla de verdad.
  allowedDevOrigins: ["192.168.*.*"],
  // quita el botón "N" de Next.js que aparece abajo a la izquierda solo mientras se desarrolla
  devIndicators: false,
};

export default nextConfig;
