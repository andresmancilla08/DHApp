"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { cardsForDomains } from "@/lib/daggerheart/cards";
import { CLASS_DEFS } from "@/lib/daggerheart/classes";
import type { ClassKey } from "@/lib/daggerheart/types";
import type { WizardData } from "./types";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

type DomainTheme = {
  from: string;
  via: string;
  accent: string;
  badge: string;
  symbol: string;
};

const DOMAIN_THEMES: Record<string, DomainTheme> = {
  arcana:   { from: "#1a0a2e", via: "#2d1464", accent: "#7c3aed", badge: "border-purple-500/40 bg-purple-950/70 text-purple-200", symbol: "✦" },
  blade:    { from: "#2e0a0a", via: "#641414", accent: "#dc2626", badge: "border-red-500/40 bg-red-950/70 text-red-200",           symbol: "⚔" },
  bone:     { from: "#1a1714", via: "#2d2720", accent: "#a3a89a", badge: "border-stone-500/40 bg-stone-900/70 text-stone-200",     symbol: "☽" },
  codex:    { from: "#0a1a2e", via: "#0f2d64", accent: "#2563eb", badge: "border-blue-500/40 bg-blue-950/70 text-blue-200",         symbol: "✧" },
  grace:    { from: "#2e0a1a", via: "#641436", accent: "#ec4899", badge: "border-pink-500/40 bg-pink-950/70 text-pink-200",         symbol: "♪" },
  midnight: { from: "#0a0f2e", via: "#141f64", accent: "#6366f1", badge: "border-indigo-500/40 bg-indigo-950/70 text-indigo-200",   symbol: "◆" },
  sage:     { from: "#0a1e10", via: "#0f3d1a", accent: "#16a34a", badge: "border-green-500/40 bg-green-950/70 text-green-200",     symbol: "✿" },
  splendor: { from: "#1e1500", via: "#3d2a00", accent: "#d9a441", badge: "border-yellow-500/40 bg-yellow-950/70 text-yellow-200",   symbol: "☀" },
  valor:    { from: "#1e0f00", via: "#3d2000", accent: "#d97706", badge: "border-amber-500/40 bg-amber-950/70 text-amber-200",     symbol: "⚜" },
};

const TYPE_BADGE: Record<string, string> = {
  ability:  "border-sky-500/30 bg-sky-950/60 text-sky-200",
  spell:    "border-violet-500/30 bg-violet-950/60 text-violet-200",
  grimoire: "border-yellow-500/30 bg-yellow-950/60 text-yellow-100",
};

export function StepDomainCards({ data, onChange }: Props) {
  const { t } = useTranslation();

  if (!data.classKey) return null;
  const classDef = CLASS_DEFS[data.classKey as ClassKey];
  const cards = cardsForDomains(classDef.domains, 1);
  const selected = data.domainCardIds;

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange({ domainCardIds: selected.filter((s) => s !== id) });
    } else if (selected.length < 2) {
      onChange({ domainCardIds: [...selected, id] });
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-2">
      {/* Counter — subtitle already rendered by wizard header */}
      <div className="flex items-center justify-end px-0.5">
        <span
          className={`text-sm font-bold tabular-nums transition-colors duration-150 ${
            selected.length === 2 ? "text-gold" : "text-muted"
          }`}
        >
          {t("wizard.cards.selected", { count: selected.length })}
        </span>
      </div>

      {/* Card list */}
      <div className="flex flex-col gap-3">
        {cards.map((card, i) => {
          const isSelected = selected.includes(card.id);
          const isDisabled = !isSelected && selected.length >= 2;
          const theme = DOMAIN_THEMES[card.domain] ?? DOMAIN_THEMES.valor;

          return (
            <button
              key={card.id}
              type="button"
              disabled={isDisabled}
              onClick={() => toggle(card.id)}
              aria-pressed={isSelected}
              style={{
                animationDelay: `${i * 30}ms`,
                borderColor: isSelected ? `${theme.accent}66` : undefined,
                boxShadow: isSelected
                  ? `0 0 0 1px ${theme.accent}33, 0 8px 32px -8px ${theme.accent}44`
                  : undefined,
              }}
              className={[
                "dh-rise group relative overflow-hidden rounded-2xl border text-left",
                "transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
                "active:scale-[0.985]",
                isDisabled
                  ? "cursor-not-allowed border-border/20 opacity-30"
                  : isSelected
                  ? "border-transparent"
                  : "border-border hover:border-border-strong",
              ].join(" ")}
            >
              {/* ── Art area ─────────────────────────────────────────────── */}
              <div
                className="relative h-[96px] overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.via} 50%, ${theme.from} 100%)`,
                }}
              >
                {/* CoreBook illustration — brighter, centered on the character */}
                <Image
                  src={`/art/cards/${card.id}.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center 20%",
                    opacity: 0.85,
                    filter: "brightness(0.72) saturate(1.2)",
                  }}
                />
                {/* Subtle domain tint — left/right edges only, keep center clear */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, ${theme.from}ee 0%, transparent 35%, transparent 65%, ${theme.from}ee 100%)`,
                  }}
                />
                {/* Bottom fade to card content */}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface-2/90 to-transparent" />
                {/* Domain symbol — bottom-left corner, subtle */}
                <span
                  className="pointer-events-none absolute bottom-2 left-3 select-none font-display text-2xl leading-none"
                  style={{ color: theme.accent, opacity: 0.55 }}
                  aria-hidden
                >
                  {theme.symbol}
                </span>

                {/* Selected overlay + checkmark */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full"
                      style={{
                        background: theme.accent,
                        boxShadow: `0 0 18px ${theme.accent}88`,
                      }}
                    >
                      <span className="text-sm font-bold text-black/75">✓</span>
                    </div>
                  </div>
                )}

                {/* Recall cost — top right */}
                <div className="absolute right-2.5 top-2.5">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-black/50 backdrop-blur-sm"
                    title={t("wizard.cards.recallCost", { cost: card.recallCost })}
                  >
                    <span className="font-display text-[10px] font-bold text-white/70">
                      {card.recallCost}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Content area ─────────────────────────────────────────── */}
              <div className="flex flex-col gap-2 bg-surface-2/40 px-3.5 pb-3.5 pt-2.5">
                {/* Domain + type badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={`rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${theme.badge}`}
                  >
                    {t(`dh.domain.${card.domain}`)}
                  </span>
                  <span
                    className={`rounded border px-2 py-0.5 text-[9px] font-medium ${TYPE_BADGE[card.type] ?? ""}`}
                  >
                    {t(`wizard.cards.${card.type}`)}
                  </span>
                </div>

                {/* Card name */}
                <p className="font-display text-sm font-semibold leading-snug text-foreground">
                  {t(`dh.card.${card.id}`)}
                </p>

                {/* Description */}
                <p className="text-[11px] leading-relaxed text-muted">
                  {t(`dh.card.${card.id}_desc`)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
