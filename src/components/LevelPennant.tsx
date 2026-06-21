// Decorative level banner ("pendón") shown on domain-card covers.
// Gold gonfalon with swallowtail bottom. Uses filter drop-shadow (clip-path
// would clip a regular box-shadow) plus inset highlights for depth.

export function LevelPennant({
  level,
  side = "right",
  size = "sm",
  label,
}: {
  level: number;
  side?: "left" | "right";
  size?: "sm" | "md";
  /** Accessible label (e.g. "Nivel 3"). When omitted the pennant is decorative. */
  label?: string;
}) {
  const dims =
    size === "md"
      ? "h-[52px] w-[38px] pb-3.5 text-lg"
      : "h-9 w-7 pb-2.5 text-[13px]";
  const pos = side === "right" ? "right-2.5" : "left-2.5";
  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true };

  return (
    <span
      {...a11y}
      className={`pointer-events-none absolute top-0 z-10 flex items-center justify-center font-display font-bold leading-none tabular-nums text-[#3a2606] drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)] ${dims} ${pos}`}
      style={{
        background:
          "linear-gradient(180deg, var(--gold-bright) 0%, var(--gold) 52%, var(--gold-deep) 100%)",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 64%, 0 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 0 0 1px rgba(58,38,6,0.2), inset 0 -7px 9px -6px rgba(58,38,6,0.55)",
      }}
    >
      {level}
    </span>
  );
}
