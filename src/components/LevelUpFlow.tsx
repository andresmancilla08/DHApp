"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { levelUpCharacter } from "@/lib/characters/actions";
import { DOMAIN_CARDS } from "@/lib/daggerheart/cards";
import { CLASS_DEFS } from "@/lib/daggerheart/classes";
import type { Character, TraitKey } from "@/lib/daggerheart/types";
import type { LevelUpAdvancement } from "@/lib/characters/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  character: Character;
  open: boolean;
  onClose: () => void;
}

type Step = "choose" | "boostTraits" | "pickCard" | "confirm" | "done";

type OptionType =
  | "boostTraits"
  | "hp"
  | "stress"
  | "experiences"
  | "domainCard"
  | "evasion"
  | "proficiency";

const OPTIONS: { type: OptionType }[] = [
  { type: "boostTraits" },
  { type: "hp" },
  { type: "stress" },
  { type: "experiences" },
  { type: "domainCard" },
  { type: "evasion" },
  { type: "proficiency" },
];

const ALL_TRAITS: TraitKey[] = [
  "agility",
  "strength",
  "finesse",
  "instinct",
  "presence",
  "knowledge",
];

// Level achievements at 2, 5, 8
const ACHIEVEMENT_LEVELS = new Set([2, 5, 8]);

// Shared primary CTA — matches the app's bright-gold pill (wizard/home).
const PRIMARY_BTN =
  "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-bright to-gold text-sm font-bold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright";
// Secondary text button (back).
const BACK_BTN =
  "flex min-h-[44px] items-center justify-center py-3 text-sm font-medium text-muted transition hover:text-foreground active:scale-[0.99]";

// ─── Main component ───────────────────────────────────────────────────────────

export function LevelUpFlow({ character, open, onClose }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  const [step, setStep] = useState<Step>("choose");
  const [advancements, setAdvancements] = useState<LevelUpAdvancement[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const [pendingTraits, setPendingTraits] = useState<TraitKey[]>([]);
  const [pendingCard, setPendingCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset state when sheet opens
  useEffect(() => {
    if (open) {
      setStep("choose");
      setAdvancements([]);
      setSelectedOptions([]);
      setPendingTraits([]);
      setPendingCard(null);
      setLoading(false);
      setErrorMsg(null);
    }
  }, [open]);

  const newLevel = character.level + 1;
  const boostedTraits: TraitKey[] = (character as { boostedTraits?: TraitKey[] }).boostedTraits ?? [];

  const classDef = CLASS_DEFS[character.classKey];

  // Cards available for this character's class domains, not already owned, at or below newLevel
  const ownedCardIds = new Set([
    ...character.loadout,
    ...character.vault,
    ...advancements
      .filter((a): a is Extract<LevelUpAdvancement, { type: "domainCard" }> => a.type === "domainCard")
      .map((a) => a.cardId),
  ]);

  const availableCards = DOMAIN_CARDS.filter(
    (card) =>
      classDef.domains.includes(card.domain) &&
      !ownedCardIds.has(card.id) &&
      card.level <= newLevel,
  );

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleClose = useCallback(() => {
    if (!loading) onClose();
  }, [loading, onClose]);

  const toggleOption = (type: OptionType) => {
    setSelectedOptions((prev) => {
      if (prev.includes(type)) return prev.filter((o) => o !== type);
      if (prev.length >= 2) return prev;
      return [...prev, type];
    });
  };

  const handleChooseContinue = () => {
    // Build advancements for options that don't need sub-steps
    const newAdvancements: LevelUpAdvancement[] = [];

    for (const optType of selectedOptions) {
      if (optType === "boostTraits") continue; // handled in sub-step
      if (optType === "domainCard") continue; // handled in sub-step

      if (optType === "experiences") {
        const ids: [string, string] = [
          character.experiences[0]?.id ?? "",
          character.experiences[1]?.id ?? "",
        ];
        newAdvancements.push({ type: "experiences", experienceIds: ids });
      } else {
        newAdvancements.push({ type: optType } as LevelUpAdvancement);
      }
    }

    setAdvancements(newAdvancements);

    // Navigate to sub-steps if needed
    if (selectedOptions.includes("boostTraits")) {
      setStep("boostTraits");
      return;
    }
    if (selectedOptions.includes("domainCard")) {
      setStep("pickCard");
      return;
    }
    setStep("confirm");
  };

  const handleBoostTraitsConfirm = () => {
    if (pendingTraits.length !== 2) return;
    const advancement: LevelUpAdvancement = {
      type: "boostTraits",
      traits: [pendingTraits[0], pendingTraits[1]],
    };
    setAdvancements((prev) => [...prev, advancement]);

    // Check if domainCard still needs sub-step
    if (selectedOptions.includes("domainCard")) {
      setStep("pickCard");
    } else {
      setStep("confirm");
    }
  };

  const handlePickCardConfirm = () => {
    if (!pendingCard) return;
    const advancement: LevelUpAdvancement = { type: "domainCard", cardId: pendingCard };
    setAdvancements((prev) => [...prev, advancement]);
    setStep("confirm");
  };

  const handleApplyLevelUp = async () => {
    if (advancements.length !== 2) {
      setErrorMsg(t("levelUp.errors.needTwo"));
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await levelUpCharacter(
        character.id,
        advancements as [LevelUpAdvancement, LevelUpAdvancement],
      );
      if ("error" in result) {
        setErrorMsg(t(result.error));
        setLoading(false);
      } else {
        setStep("done");
        setLoading(false);
      }
    } catch {
      setErrorMsg(t("levelUp.errors.unknown"));
      setLoading(false);
    }
  };

  const handleDone = () => {
    router.refresh();
    onClose();
  };

  const toggleTrait = (trait: TraitKey) => {
    setPendingTraits((prev) => {
      if (prev.includes(trait)) return prev.filter((t) => t !== trait);
      if (prev.length >= 2) return prev;
      return [...prev, trait];
    });
  };

  // ─── Label per step ─────────────────────────────────────────────────────────

  const sheetLabel =
    step === "boostTraits"
      ? t("levelUp.boostTraits.title")
      : step === "pickCard"
        ? t("levelUp.pickCard.title")
        : step === "confirm"
          ? t("levelUp.confirm.title", { level: newLevel })
          : step === "done"
            ? t("levelUp.done.title")
            : t("levelUp.title");

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <BottomSheet open={open} onClose={handleClose} label={sheetLabel}>
      {step === "choose" && (
        <ChooseStep
          t={t}
          selectedOptions={selectedOptions}
          onToggle={toggleOption}
          onContinue={handleChooseContinue}
          newLevel={newLevel}
        />
      )}
      {step === "boostTraits" && (
        <BoostTraitsStep
          t={t}
          boostedTraits={boostedTraits}
          pendingTraits={pendingTraits}
          onToggle={toggleTrait}
          onConfirm={handleBoostTraitsConfirm}
          onBack={() => setStep("choose")}
        />
      )}
      {step === "pickCard" && (
        <PickCardStep
          t={t}
          availableCards={availableCards}
          pendingCard={pendingCard}
          onSelect={setPendingCard}
          onConfirm={handlePickCardConfirm}
          onBack={() => setStep("choose")}
        />
      )}
      {step === "confirm" && (
        <ConfirmStep
          t={t}
          newLevel={newLevel}
          advancements={advancements}
          loading={loading}
          errorMsg={errorMsg}
          onApply={handleApplyLevelUp}
          onBack={() => setStep("choose")}
        />
      )}
      {step === "done" && (
        <DoneStep
          t={t}
          newLevel={newLevel}
          onDone={handleDone}
        />
      )}
    </BottomSheet>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

type TFunction = ReturnType<typeof useTranslation>["t"];

// ── ChooseStep ────────────────────────────────────────────────────────────────

function ChooseStep({
  t,
  selectedOptions,
  onToggle,
  onContinue,
  newLevel,
}: {
  t: TFunction;
  selectedOptions: OptionType[];
  onToggle: (type: OptionType) => void;
  onContinue: () => void;
  newLevel: number;
}) {
  const canContinue = selectedOptions.length === 2;

  const needsSubStep = (type: OptionType) =>
    type === "boostTraits" || type === "domainCard";

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="mb-5 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-gold/60">
          {t("levelUp.levelLabel", { level: newLevel })}
        </p>
        <h2 className="mt-1 font-display text-xl font-bold text-gold">
          {t("levelUp.title")}
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          {t("levelUp.chooseInstruction")}
        </p>
      </div>

      {/* Options list */}
      <div className="flex flex-col gap-2.5 overflow-y-auto" style={{ maxHeight: "55vh" }}>
        {OPTIONS.map(({ type }) => {
          const isSelected = selectedOptions.includes(type);
          const isDisabled = !isSelected && selectedOptions.length >= 2;
          const hasArrow = needsSubStep(type);

          return (
            <button
              key={type}
              type="button"
              onClick={() => !isDisabled && onToggle(type)}
              disabled={isDisabled}
              className={[
                "flex min-h-[56px] w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-150 active:scale-[0.985]",
                isSelected
                  ? "border-gold/60 bg-gold/10"
                  : "border-border bg-surface-2/20",
                isDisabled ? "pointer-events-none opacity-40" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* Radio indicator */}
              <span
                className={[
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected
                    ? "border-gold bg-gold"
                    : "border-muted/50 bg-transparent",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-background" />
                )}
              </span>

              {/* Text */}
              <span className="flex-1">
                <span className="block text-sm font-bold text-white">
                  {t(`levelUp.options.${type}.title`)}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                  {t(`levelUp.options.${type}.description`)}
                </span>
              </span>

              {/* Sub-step arrow badge */}
              {isSelected && hasArrow && (
                <span className="mt-0.5 shrink-0 rounded-full bg-gold/20 px-2 py-0.5 text-xs font-semibold text-gold">
                  →
                </span>
              )}
            </button>
          );
        })}

        {/* Coming soon options */}
        {(["comingSoon1", "comingSoon2"] as const).map((key) => (
          <div
            key={key}
            className="flex min-h-[56px] w-full items-center gap-3 rounded-2xl border border-border bg-surface-2/20 px-4 py-3.5 opacity-40"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-muted/50" />
            <span className="flex-1">
              <span className="block text-sm font-bold text-white">
                {t(`levelUp.options.${key}.title`)}
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                {t("levelUp.comingSoon")}
              </span>
            </span>
            <span className="rounded-full bg-fear/20 px-2 py-0.5 text-xs text-fear">
              {t("levelUp.soon")}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-5 shrink-0">
        <button type="button" onClick={onContinue} disabled={!canContinue} className={PRIMARY_BTN}>
          {t("levelUp.continue")}
        </button>
      </div>
    </div>
  );
}

// ── BoostTraitsStep ───────────────────────────────────────────────────────────

function BoostTraitsStep({
  t,
  boostedTraits,
  pendingTraits,
  onToggle,
  onConfirm,
  onBack,
}: {
  t: TFunction;
  boostedTraits: TraitKey[];
  pendingTraits: TraitKey[];
  onToggle: (trait: TraitKey) => void;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const canConfirm = pendingTraits.length === 2;

  return (
    <div className="flex flex-col pb-4">
      <div className="mb-5 text-center">
        <p className="mb-2 text-xs text-muted/60 tracking-wider">
          {pendingTraits.length}/2 {t("levelUp.selectTwoTraits")}
        </p>
        <h2 className="font-display text-xl font-bold text-gold">
          {t("levelUp.boostTraits.title")}
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          {t("levelUp.boostTraits.instruction")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ALL_TRAITS.map((trait) => {
          const alreadyBoosted = boostedTraits.includes(trait);
          const isSelected = pendingTraits.includes(trait);
          const isDisabled = alreadyBoosted || (!isSelected && pendingTraits.length >= 2);

          return (
            <button
              key={trait}
              type="button"
              onClick={() => !isDisabled && onToggle(trait)}
              disabled={isDisabled}
              className={[
                "flex min-h-[56px] flex-col items-center justify-center rounded-2xl border py-3 transition-all duration-150 active:scale-[0.985]",
                isSelected
                  ? "border-gold/60 bg-gold/10"
                  : "border-border bg-surface-2/20",
                isDisabled ? "pointer-events-none opacity-40" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="text-sm font-bold capitalize text-white">
                {t(`dh.trait.${trait}`)}
              </span>
              {alreadyBoosted && (
                <span className="mt-0.5 text-xs text-muted">
                  {t("levelUp.boostTraits.alreadyBoosted")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2 shrink-0">
        <button type="button" onClick={onConfirm} disabled={!canConfirm} className={PRIMARY_BTN}>
          {t("levelUp.boostTraits.confirm")}
        </button>
        <button type="button" onClick={onBack} className={BACK_BTN}>
          {t("levelUp.back")}
        </button>
      </div>
    </div>
  );
}

// ── PickCardStep ──────────────────────────────────────────────────────────────

interface CardDef {
  id: string;
  domain: string;
  level: number;
  type: string;
  recallCost: number;
}

function PickCardStep({
  t,
  availableCards,
  pendingCard,
  onSelect,
  onConfirm,
  onBack,
}: {
  t: TFunction;
  availableCards: CardDef[];
  pendingCard: string | null;
  onSelect: (id: string) => void;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const canConfirm = pendingCard !== null;

  return (
    <div className="flex flex-col pb-4">
      <div className="mb-5 text-center">
        <h2 className="font-display text-xl font-bold text-gold">
          {t("levelUp.pickCard.title")}
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          {t("levelUp.pickCard.instruction")}
        </p>
      </div>

      <div className="flex flex-col gap-2.5 overflow-y-auto" style={{ maxHeight: "50vh" }}>
        {availableCards.length === 0 && (
          <p className="py-6 text-center text-sm text-muted">
            {t("levelUp.pickCard.empty")}
          </p>
        )}
        {availableCards.map((card) => {
          const isSelected = pendingCard === card.id;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelect(card.id)}
              className={[
                "flex min-h-[56px] w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-150 active:scale-[0.985]",
                isSelected
                  ? "border-gold/60 bg-gold/10"
                  : "border-border bg-surface-2/20",
              ].join(" ")}
            >
              {/* Selection indicator */}
              <span
                className={[
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected
                    ? "border-gold bg-gold"
                    : "border-muted/50 bg-transparent",
                ].join(" ")}
              >
                {isSelected && <span className="h-2 w-2 rounded-full bg-background" />}
              </span>

              <span className="flex-1">
                <span className="block text-sm font-bold text-white">
                  {t(`dh.card.${card.id}`, { defaultValue: card.id })}
                </span>
                <span className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                  <span>{t(`wizard.cards.${card.type}`)}</span>
                  {card.recallCost > 0 && (
                    <>
                      <span>·</span>
                      <span>{t("levelUp.pickCard.recall", { cost: card.recallCost })}</span>
                    </>
                  )}
                </span>
              </span>

              <span className="shrink-0 rounded-full border border-fear/30 bg-fear/15 px-2.5 py-0.5 text-[11px] font-semibold text-fear-bright">
                {t(`dh.domain.${card.domain}`)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2 shrink-0">
        <button type="button" onClick={onConfirm} disabled={!canConfirm} className={PRIMARY_BTN}>
          {t("levelUp.pickCard.confirm")}
        </button>
        <button type="button" onClick={onBack} className={BACK_BTN}>
          {t("levelUp.back")}
        </button>
      </div>
    </div>
  );
}

// ── ConfirmStep ───────────────────────────────────────────────────────────────

function ConfirmStep({
  t,
  newLevel,
  advancements,
  loading,
  errorMsg,
  onApply,
  onBack,
}: {
  t: TFunction;
  newLevel: number;
  advancements: LevelUpAdvancement[];
  loading: boolean;
  errorMsg: string | null;
  onApply: () => void;
  onBack: () => void;
}) {
  const hasAchievement = ACHIEVEMENT_LEVELS.has(newLevel);

  const advancementLabel = (adv: LevelUpAdvancement): string => {
    switch (adv.type) {
      case "boostTraits":
        return t("levelUp.summary.boostTraits", {
          traits: adv.traits.map((tr) => t(`dh.trait.${tr}`)).join(" & "),
        });
      case "hp":
        return t("levelUp.summary.hp");
      case "stress":
        return t("levelUp.summary.stress");
      case "experiences":
        return t("levelUp.summary.experiences");
      case "domainCard":
        return t("levelUp.summary.domainCard", {
          card: t(`dh.card.${adv.cardId}`, { defaultValue: adv.cardId }),
        });
      case "evasion":
        return t("levelUp.summary.evasion");
      case "proficiency":
        return t("levelUp.summary.proficiency");
    }
  };

  return (
    <div className="flex flex-col pb-4">
      <div className="mb-5 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-gold/60">
          {t("levelUp.confirm.subtitle")}
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold text-gold">
          {t("levelUp.confirm.title", { level: newLevel })}
        </h2>
      </div>

      {/* Level achievement badge */}
      {hasAchievement && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3">
          <span className="text-lg" aria-hidden="true">✦</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gold">
              {t("levelUp.achievement.title")}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {t("levelUp.achievement.description", { level: newLevel })}
            </p>
          </div>
          <span className="ml-auto rounded-full border border-gold/40 bg-gold/20 px-2.5 py-0.5 text-xs font-bold text-gold">
            {t("levelUp.achievement.badge")}
          </span>
        </div>
      )}

      {/* Advancements summary */}
      <div className="mb-5 flex flex-col gap-2.5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {t("levelUp.confirm.advancements")}
        </p>
        {advancements.map((adv, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/40 px-4 py-3"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-gold" />
            <span className="text-sm text-white">{advancementLabel(adv)}</span>
          </div>
        ))}
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {errorMsg}
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col gap-2 shrink-0">
        <button type="button" onClick={onApply} disabled={loading} className={PRIMARY_BTN}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                aria-hidden="true"
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              {t("levelUp.confirm.applying")}
            </span>
          ) : (
            t("levelUp.confirm.apply")
          )}
        </button>
        {!loading && (
          <button type="button" onClick={onBack} className={BACK_BTN}>
            {t("levelUp.back")}
          </button>
        )}
      </div>
    </div>
  );
}

// ── DoneStep ──────────────────────────────────────────────────────────────────

function DoneStep({
  t,
  newLevel,
  onDone,
}: {
  t: TFunction;
  newLevel: number;
  onDone: () => void;
}) {
  return (
    <div className="flex flex-col items-center pb-6 pt-2 text-center dh-rise">
      {/* Decorative glow */}
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold/30">
        <span className="font-display text-3xl font-bold text-gold">{newLevel}</span>
      </div>

      <h2 className="font-display text-2xl font-bold text-gold">
        {t("levelUp.done.congratulations", { level: newLevel })}
      </h2>

      <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-muted">
        {t("levelUp.done.description")}
      </p>

      <button type="button" onClick={onDone} className={`mt-6 ${PRIMARY_BTN}`}>
        {t("levelUp.done.viewCharacter")}
      </button>
    </div>
  );
}
