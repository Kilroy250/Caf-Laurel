"use client";

import { useEffect, useRef } from "react";
import { type MotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";

/**
 * Secuencia de cuadros dibujada en un <canvas> según un progreso de 0 a 1
 * (la técnica de las páginas de producto de Apple). Los cuadros se descargan
 * solo cuando el bloque se acerca a la pantalla.
 * Con movimiento reducido se queda en un cuadro fijo (`stillFrame`).
 */
export function ScrollSequence({
  folder,
  count,
  progress,
  stillFrame = 0,
  className,
  label,
}: {
  /** carpeta dentro de /public con archivos 000.webp, 001.webp… */
  folder: string;
  count: number;
  progress: MotionValue<number>;
  stillFrame?: number;
  className?: string;
  label: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const current = useRef(-1);
  const reduce = useReducedMotion();

  const frameAt = (p: number) =>
    reduce ? stillFrame : Math.min(count - 1, Math.max(0, Math.round(p * (count - 1))));

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
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
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

  // descarga diferida: empieza cuando falta una pantalla para llegar
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || frames.current.length) return;
        io.disconnect();
        const order = reduce ? [stillFrame] : [...Array(count).keys()];
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
  }, [folder, count, reduce]);

  useMotionValueEvent(progress, "change", (p) => {
    const i = frameAt(p);
    if (i !== current.current) requestAnimationFrame(() => draw(i));
  });

  return <canvas ref={canvasRef} role="img" aria-label={label} className={className} />;
}
