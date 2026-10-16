"use client";

import { useEffect, useRef } from "react";
import { type MotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";

/**
 * Secuencia de cuadros dibujada en un <canvas> según un progreso de 0 a 1
 * (la técnica de las páginas de producto de Apple). Los cuadros se descargan
 * solo cuando el bloque se acerca a la pantalla.
 * Con movimiento reducido se queda en un cuadro fijo (`stillFrame`).
 *
 * fit "cover": llena el lienzo (como object-cover).
 * fit "width": ocupa el ancho (× zoom) y se centra; arriba y abajo el cuadro se
 * funde con el negro. Para videos horizontales en pantallas verticales.
 * paso: descarga solo uno de cada `paso` cuadros (en celular, la mitad de datos).
 */
export function ScrollSequence({
  folder,
  count,
  progress,
  stillFrame = 0,
  className,
  label,
  fit = "cover",
  zoom = 1,
  paso = 1,
}: {
  /** carpeta dentro de /public con archivos 000.webp, 001.webp… */
  folder: string;
  count: number;
  progress: MotionValue<number>;
  stillFrame?: number;
  className?: string;
  label: string;
  fit?: "cover" | "width";
  zoom?: number;
  paso?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const current = useRef(-1);
  const reduce = useReducedMotion();
  const opciones = useRef({ fit, zoom });

  // con paso > 1 solo existen los cuadros múltiplos de `paso`
  const ultimo = Math.floor((count - 1) / paso) * paso;
  const frameAt = (p: number) =>
    reduce ? stillFrame : Math.min(ultimo, Math.max(0, Math.round((p * (count - 1)) / paso) * paso));

  // dibuja el cuadro i (o el más cercano ya descargado) cubriendo el lienzo, como object-cover
  const draw = (i: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ready = (im?: HTMLImageElement) => Boolean(im && im.complete && im.naturalWidth);
    let img = frames.current[i];
    for (let d = 1; !ready(img) && d < count; d++) {
      if (ready(frames.current[i - d])) img = frames.current[i - d];
      else if (ready(frames.current[i + d])) img = frames.current[i + d];
    }
    if (!ready(img)) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width: cw, height: ch } = canvas;
    const { fit: modo, zoom: z } = opciones.current;
    if (modo === "width") {
      const s = (cw / img.naturalWidth) * z;
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      const x = (cw - w) / 2;
      const y = (ch - h) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, w, h);
      // bordes superior e inferior fundidos con el negro del fondo
      const borde = h * 0.22;
      const arriba = ctx.createLinearGradient(0, y, 0, y + borde);
      arriba.addColorStop(0, "rgba(0,0,0,1)");
      arriba.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = arriba;
      ctx.fillRect(0, y - 1, cw, borde + 1);
      const abajo = ctx.createLinearGradient(0, y + h - borde, 0, y + h);
      abajo.addColorStop(0, "rgba(0,0,0,0)");
      abajo.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = abajo;
      ctx.fillRect(0, y + h - borde, cw, borde + 1);
    } else {
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }
    current.current = i;
  };

  // tamaño real del lienzo = tamaño en pantalla × densidad de píxeles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw(Math.max(0, current.current));
    });
    ro.observe(canvas);
    return () => ro.disconnect();
    // draw lee refs: no necesita re-suscribirse
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // si cambia el encuadre (p. ej. al saber que es celular), se redibuja
  useEffect(() => {
    opciones.current = { fit, zoom };
    draw(Math.max(0, current.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fit, zoom]);

  // descarga diferida: empieza cuando falta una pantalla para llegar
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || frames.current.length) return;
        io.disconnect();
        const order = reduce ? [stillFrame] : [...Array(count).keys()].filter((i) => i % paso === 0);
        frames.current = new Array(count);
        for (const i of order) {
          const img = new Image();
          img.decoding = "async";
          img.src = `${folder}/${String(i).padStart(3, "0")}.webp`;
          img.onload = () => {
            if (i === frameAt(progress.get()) || current.current < 0) draw(frameAt(progress.get()));
          };
          frames.current[i] = img;
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(canvas);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder, count, reduce, paso]);

  useMotionValueEvent(progress, "change", (p) => {
    const i = frameAt(p);
    if (i !== current.current) requestAnimationFrame(() => draw(i));
  });

  return <canvas ref={canvasRef} role="img" aria-label={label} className={className} />;
}
