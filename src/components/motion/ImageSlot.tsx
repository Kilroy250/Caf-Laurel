/**
 * Espacio reservado para una foto que todavía no existe.
 * Bloque de color sólido, nunca una foto de relleno que no sea de la marca.
 */
export function ImageSlot({
  note,
  tone = "rust",
  className,
  ratio = "aspect-[4/5]",
}: {
  note: string;
  tone?: "rust" | "ink" | "cream" | "stone";
  className?: string;
  ratio?: string;
}) {
  const tones = {
    rust: "bg-rust-deep text-cream/70 border-cream/15",
    ink: "bg-ink-soft text-cream/60 border-cream/15",
    cream: "bg-cream-deep text-ink/60 border-ink/15",
    stone: "bg-stone/25 text-cream/70 border-cream/20",
  } as const;

  return (
    <div
      className={`relative flex ${ratio} w-full items-end overflow-hidden border ${tones[tone]} ${className ?? ""}`}
    >
      <div className="p-5">
        <p className="micro opacity-70">Espacio reservado</p>
        <p className="mt-2 max-w-[28ch] text-sm leading-snug">{note}</p>
      </div>
    </div>
  );
}
