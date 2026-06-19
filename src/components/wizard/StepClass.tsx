"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { CLASSES } from "@/lib/daggerheart/reference";
import { CLASS_DEFS, SUBCLASS_DEFS } from "@/lib/daggerheart/classes";
import { SelectionCard } from "./SelectionCard";
import type { WizardData } from "./types";
import type { ClassKey } from "@/lib/daggerheart/types";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

const CLASS_ART: Record<string, string> = {
  bard:     "/art/bard.jpg",
  druid:    "/art/druid.jpg",
  guardian: "/art/guardian.jpg",
  ranger:   "/art/ranger.jpg",
  rogue:    "/art/rogue.jpg",
  seraph:   "/art/seraph.jpg",
  sorcerer: "/art/sorcerer.jpg",
  warrior:  "/art/warrior.jpg",
  wizard:   "/art/wizard.jpg",
};

const domainColors: Record<string, string> = {
  arcana:   "text-purple-300 bg-purple-900/30",
  blade:    "text-red-300 bg-red-900/30",
  bone:     "text-stone-300 bg-stone-800/40",
  codex:    "text-blue-300 bg-blue-900/30",
  grace:    "text-pink-300 bg-pink-900/30",
  midnight: "text-indigo-300 bg-indigo-900/30",
  sage:     "text-green-300 bg-green-900/30",
  splendor: "text-gold bg-gold/10",
  valor:    "text-amber-300 bg-amber-900/30",
};

export function StepClass({ data, onChange }: Props) {
  const { t } = useTranslation();

  const selectedClass = data.classKey ? CLASS_DEFS[data.classKey] : null;
  const subclasses = selectedClass
    ? selectedClass.subclasses.map((sk) => SUBCLASS_DEFS[sk])
    : [];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Class grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CLASSES.map((key) => {
          const def = CLASS_DEFS[key];
          const art = CLASS_ART[key];
          const isSelected = data.classKey === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() =>
                onChange({ classKey: key as ClassKey, subclassKey: null, domainCardIds: [] })
              }
              className={[
                "group relative flex min-h-[180px] flex-col overflow-hidden rounded-2xl border text-left",
                "transition-all duration-150 active:scale-[0.97]",
                isSelected
                  ? [
                      "border-gold",
                      "shadow-[0_0_0_1px_rgba(217,164,65,0.5),0_0_18px_-4px_rgba(217,164,65,0.45),0_4px_24px_-8px_rgba(217,164,65,0.3)]",
                    ].join(" ")
                  : "border-border bg-surface-2/40 hover:border-border-strong",
              ].join(" ")}
            >
              {/* Art hero */}
              {art ? (
                <div className="relative h-[110px] w-full shrink-0 sm:h-[120px]">
                  <Image
                    src={art}
                    alt=""
                    fill
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  {/* Fade bottom so info merges seamlessly */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17131f] via-[#17131f]/30 to-transparent" />
                  {/* Gold shimmer on selection */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-t from-gold/[0.10] via-transparent to-transparent" />
                  )}
                </div>
              ) : (
                /* Fallback when no art */
                <div className="h-[110px] w-full shrink-0 bg-surface-2/60 sm:h-[120px]" />
              )}

              {/* Info area */}
              <div className="flex flex-1 flex-col gap-1.5 px-3 pb-3 pt-2">
                <span className="font-display text-sm font-semibold leading-tight text-foreground">
                  {t(`dh.class.${key}`)}
                </span>

                {/* Domain pills */}
                <div className="flex flex-wrap gap-1">
                  {def.domains.map((d) => (
                    <span
                      key={d}
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                        domainColors[d] ?? "text-muted bg-surface"
                      }`}
                    >
                      {t(`dh.domain.${d}`)}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex gap-3 text-[11px] text-muted">
                  <span>
                    {t("wizard.class.evasion")} {def.evasion}
                  </span>
                  <span>
                    {t("wizard.class.hp")} {def.hp}
                  </span>
                </div>
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-[#2a1d05] shadow-[0_0_8px_rgba(217,164,65,0.6)]">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Subclass section — animates in after class selection ────────── */}
      {selectedClass && data.classKey && (
        <div className="dh-rise flex flex-col gap-4">
          {/* Subclass label */}
          <p className="text-sm font-semibold uppercase tracking-wider text-foreground/70">
            {t("wizard.class.subclassTitle")}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {subclasses.map((sub) => (
              <SelectionCard
                key={sub.key}
                selected={data.subclassKey === sub.key}
                onClick={() => onChange({ subclassKey: sub.key })}
                title={t(`dh.subclass.${sub.key}`)}
                description={t(`dh.subclass.${sub.key}_desc`)}
              >
                {sub.spellcastTrait && (
                  <span className="mt-1 text-[11px] text-fear-bright">
                    {t("wizard.class.spellcast", {
                      trait: t(`dh.trait.${sub.spellcastTrait}`),
                    })}
                  </span>
                )}
              </SelectionCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
