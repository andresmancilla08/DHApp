"use client";

import { useTranslation } from "react-i18next";
import { TRAITS, TRAIT_ARRAY } from "@/lib/daggerheart/reference";
import type { TraitKey } from "@/lib/daggerheart/types";
import type { WizardData } from "./types";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
  suggestedTraits?: Partial<Record<TraitKey, number>> | null;
  spellcastTrait?: TraitKey | null;
  suggestedClassName?: string;
}

function modLabel(v: number) {
  return v > 0 ? `+${v}` : `${v}`;
}

type ChipState = "assigned" | "pending" | "available";

function buildChipStates(
  traitArray: readonly number[],
  traits: Record<TraitKey, number | null>,
  pendingModifier: number | null,
): ChipState[] {
  // Count how many of each value are assigned to traits
  const assignedByVal: Record<number, number> = {};
  for (const v of Object.values(traits)) {
    if (v !== null) assignedByVal[v] = (assignedByVal[v] ?? 0) + 1;
  }

  const rem = { ...assignedByVal };
  let pendingMarked = false;

  return traitArray.map((val) => {
    if (rem[val] && rem[val] > 0) {
      rem[val]--;
      return "assigned";
    }
    if (!pendingMarked && pendingModifier === val) {
      pendingMarked = true;
      return "pending";
    }
    return "available";
  });
}

export function StepTraits({
  data,
  onChange,
  suggestedTraits,
  spellcastTrait,
  suggestedClassName,
}: Props) {
  const { t } = useTranslation();

  const chipStates = buildChipStates(TRAIT_ARRAY, data.traits, data.pendingModifier);
  const hasPending = data.pendingModifier !== null;
  const pool = [...TRAIT_ARRAY] as number[];
  for (const v of Object.values(data.traits)) {
    if (v !== null) {
      const idx = pool.indexOf(v);
      if (idx !== -1) pool.splice(idx, 1);
    }
  }
  const allAssigned = pool.length === 0;
  const hasSuggested =
    suggestedTraits && Object.keys(suggestedTraits).length === 6;

  function handlePoolChip(val: number, state: ChipState) {
    if (state === "assigned") return;
    onChange({ pendingModifier: data.pendingModifier === val && state === "pending" ? null : val });
  }

  function handleTrait(key: TraitKey) {
    const current = data.traits[key];
    if (hasPending) {
      onChange({ traits: { ...data.traits, [key]: data.pendingModifier }, pendingModifier: null });
    } else if (current !== null) {
      onChange({ traits: { ...data.traits, [key]: null } });
    }
  }

  function applySuggested() {
    if (!suggestedTraits) return;
    const newTraits = { ...data.traits } as Record<TraitKey, number | null>;
    for (const key of TRAITS) {
      newTraits[key] = suggestedTraits[key] ?? null;
    }
    onChange({ traits: newTraits, pendingModifier: null });
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Modifier pool ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-surface-2/30 p-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted">
          {t("wizard.traits.pool")}
        </p>

        {/* Chips */}
        <div className="flex flex-wrap gap-2">
          {TRAIT_ARRAY.map((val, i) => {
            const state = chipStates[i];
            return (
              <button
                key={i}
                type="button"
                disabled={state === "assigned"}
                onClick={() => handlePoolChip(val, state)}
                className={[
                  "h-11 min-w-[44px] rounded-full border px-4 font-display text-sm font-bold",
                  "transition-all duration-100 active:scale-[0.91]",
                  state === "assigned"
                    ? "cursor-not-allowed border-border/15 text-muted/20"
                    : state === "pending"
                    ? "border-gold bg-gold text-[#2a1d05] shadow-[0_0_18px_-2px_rgba(217,164,65,0.65)]"
                    : "border-border-strong bg-surface-2 text-foreground hover:border-gold/50 hover:shadow-[0_0_10px_-4px_rgba(217,164,65,0.3)]",
                ].join(" ")}
              >
                {modLabel(val)}
              </button>
            );
          })}
        </div>

        {/* Pending hint */}
        {hasPending && (
          <p
            className="mt-2.5 text-[11px] font-medium text-gold/80"
            style={{ animation: "none" }}
          >
            {t("wizard.traits.pendingHint", { mod: modLabel(data.pendingModifier!) })}
          </p>
        )}

        {/* Suggested button */}
        {hasSuggested && (
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={applySuggested}
              className="rounded-full border border-gold/40 px-4 py-1.5 text-xs font-semibold text-gold transition-all duration-100 hover:border-gold/70 hover:bg-gold/[0.08] active:scale-[0.97]"
            >
              {t("wizard.traits.applySuggested")}
            </button>
            {suggestedClassName && (
              <span className="text-[10px] text-muted/70">
                {t("wizard.traits.suggestedFor", { className: suggestedClassName })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Trait cards ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        {TRAITS.map((key, i) => {
          const val = data.traits[key];
          const hasValue = val !== null;
          const isSpellcast = spellcastTrait === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleTrait(key)}
              style={{
                transitionDelay: `${i * 20}ms`,
              }}
              className={[
                "group flex items-center gap-3 rounded-2xl border px-4 py-3 text-left",
                "transition-all duration-150 active:scale-[0.98]",
                hasPending
                  ? "border-gold/35 bg-gold/[0.04] shadow-[0_0_14px_-6px_rgba(217,164,65,0.4)]"
                  : hasValue
                  ? "border-border-strong bg-surface-2/60"
                  : "border-border bg-surface-2/30",
              ].join(" ")}
            >
              {/* Value badge */}
              <div
                className={[
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border",
                  "font-display text-sm font-bold transition-all duration-200",
                  hasValue
                    ? "border-gold/50 bg-gradient-to-b from-gold/20 to-gold/5 text-gold shadow-[0_0_12px_-2px_rgba(217,164,65,0.5)]"
                    : hasPending
                    ? "border-gold/25 bg-gold/[0.06] text-gold/35"
                    : "border-border bg-surface text-muted/35",
                ].join(" ")}
              >
                {hasValue ? modLabel(val) : "·"}
              </div>

              {/* Name + verbs */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold leading-tight text-foreground">
                    {t(`dh.trait.${key}`)}
                  </p>
                  {isSpellcast && (
                    <span
                      className="text-[9px] text-gold/80"
                      title={t("wizard.traits.spellcastHint")}
                    >
                      ✦
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] text-muted">
                  {t(`dh.trait.${key}_verbs`)}
                </p>
              </div>

              {/* Action hint */}
              <span
                className={[
                  "shrink-0 text-[10px] font-medium transition-opacity duration-150",
                  hasPending
                    ? hasValue
                      ? "text-gold/55 opacity-100"
                      : "text-gold/70 opacity-100"
                    : hasValue
                    ? "text-muted/45 opacity-0 group-hover:opacity-100"
                    : "opacity-0",
                ].join(" ")}
              >
                {hasPending
                  ? hasValue
                    ? t("wizard.traits.tapReplace")
                    : t("wizard.traits.tapAssign")
                  : t("wizard.traits.tapRemove")}
              </span>
            </button>
          );
        })}
      </div>

      {/* All assigned confirmation */}
      {allAssigned && (
        <p className="text-center text-xs font-medium text-gold/70">
          {t("wizard.traits.allAssigned")}
        </p>
      )}
    </div>
  );
}
