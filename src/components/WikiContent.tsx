"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { IconSearch, IconX, IconBookOff } from "@tabler/icons-react";
import { WIKI_ENTRIES, EQUIP_DISPLAY, type WikiCategory, type WikiEntry } from "@/lib/wiki/entries";

// ── Category meta ────────────────────────────────────────────────────────────

type CategoryOption = WikiCategory | "all";

interface CategoryMeta {
  value: CategoryOption;
  emoji: string;
  labelKey: string;
  accentClass: string;
  spineClass: string;
  badgeClass: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    value: "all",
    emoji: "✦",
    labelKey: "wiki.all",
    accentClass: "border-gold/40 bg-gold/[0.12] text-gold",
    spineClass: "bg-gold/60",
    badgeClass: "bg-gold/10 text-gold",
  },
  {
    value: "ancestry",
    emoji: "🧬",
    labelKey: "wiki.category.ancestry",
    accentClass: "border-gold/40 bg-gold/[0.12] text-gold",
    spineClass: "bg-gold/40",
    badgeClass: "bg-gold/10 text-gold/80",
  },
  {
    value: "community",
    emoji: "🏘️",
    labelKey: "wiki.category.community",
    accentClass: "border-gold/40 bg-gold/[0.12] text-gold",
    spineClass: "bg-gold/40",
    badgeClass: "bg-gold/10 text-gold/80",
  },
  {
    value: "class",
    emoji: "⚔️",
    labelKey: "wiki.category.class",
    accentClass: "border-fear/40 bg-fear/[0.12] text-fear-bright",
    spineClass: "bg-fear/60",
    badgeClass: "bg-fear/10 text-fear-bright",
  },
  {
    value: "domain",
    emoji: "✨",
    labelKey: "wiki.category.domain",
    accentClass: "border-fear/40 bg-fear/[0.12] text-fear-bright",
    spineClass: "bg-fear/60",
    badgeClass: "bg-fear/10 text-fear-bright",
  },
  {
    value: "equipment",
    emoji: "🗡️",
    labelKey: "wiki.category.equipment",
    accentClass: "border-border bg-surface-2/60 text-muted",
    spineClass: "bg-muted/30",
    badgeClass: "bg-surface-2/80 text-muted",
  },
  {
    value: "rules",
    emoji: "📜",
    labelKey: "wiki.category.rules",
    accentClass: "border-gold/40 bg-gold/[0.12] text-gold",
    spineClass: "bg-gold/40",
    badgeClass: "bg-gold/10 text-gold/80",
  },
];

const META_BY_VALUE: Record<CategoryOption, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c]),
) as Record<CategoryOption, CategoryMeta>;

// ── Equipment name/desc resolution ───────────────────────────────────────────

function resolveEntryName(entry: WikiEntry, t: (key: string) => string): string {
  if (entry.category === "equipment") {
    const equipId = entry.id.replace(/^equip_/, "");
    return EQUIP_DISPLAY[equipId]?.name ?? entry.id;
  }
  return t(entry.nameKey);
}

function resolveEntryDesc(entry: WikiEntry, t: (key: string) => string): string {
  if (entry.category === "equipment") {
    const equipId = entry.id.replace(/^equip_/, "");
    const display = EQUIP_DISPLAY[equipId];
    if (!display) return "";
    const { stats, isArmor } = display;
    if (isArmor) {
      const feature = stats.featureKey
        ? ` · ${t(`dh.equipFeature.${stats.featureKey}`)}`
        : "";
      return `${t("wizard.equipment.score")} ${stats.score} · ${t("wizard.equipment.minor")} ${stats.minor} · ${t("wizard.equipment.severe")} ${stats.severe}${feature}`;
    }
    const dmgLabel =
      stats.dmgType === "mag"
        ? t("wizard.equipment.magic")
        : t("wizard.equipment.physical");
    const burdenLabel =
      stats.burden === "oneHanded"
        ? t("wizard.equipment.oneHandedShort")
        : t("wizard.equipment.twoHandedShort");
    const feature = stats.featureKey
      ? ` · ${t(`dh.equipFeature.${stats.featureKey}`)}`
      : "";
    const spellcast = stats.requiresSpellcast
      ? ` · ${t("wizard.equipment.spellcastRequired")}`
      : "";
    return `${dmgLabel} · ${stats.damage} · ${stats.range} · ${burdenLabel}${feature}${spellcast}`;
  }
  return t(entry.descKey);
}

// ── WikiCard ──────────────────────────────────────────────────────────────────

function WikiCard({ entry }: { entry: WikiEntry }) {
  const { t } = useTranslation();
  const meta = META_BY_VALUE[entry.category];
  const name = resolveEntryName(entry, t);
  const desc = resolveEntryDesc(entry, t);
  const categoryLabel = t(meta.labelKey);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-2/20 transition-all duration-150 active:scale-[0.985] hover:bg-surface-2/40 hover:border-border-strong">
      {/* Category spine — the top ruled line that acts as entry type marker */}
      <div className={`h-[3px] w-full shrink-0 ${meta.spineClass}`} aria-hidden />

      <div className="flex flex-col gap-2 p-4">
        {/* Header row: name + category badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug text-foreground">
            {name}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${meta.badgeClass}`}
          >
            {categoryLabel}
          </span>
        </div>

        {/* Description */}
        {desc && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted">{desc}</p>
        )}

        {/* Tags — equipment metadata chips */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {entry.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/60 bg-surface-2/40 px-2 py-0.5 text-[10px] text-muted/70"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// ── WikiContent ───────────────────────────────────────────────────────────────

export function WikiContent() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryOption>("all");

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const last = CATEGORIES.length - 1;
      let next = index;
      if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
      else if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = last;
      else return;
      e.preventDefault();
      tabRefs.current[next]?.focus();
      setActiveCategory(CATEGORIES[next].value);
    },
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return WIKI_ENTRIES.filter((entry) => {
      // Category filter
      if (activeCategory !== "all" && entry.category !== activeCategory) return false;

      // Text search — resolve actual display strings before matching
      if (q.length === 0) return true;

      const name =
        entry.category === "equipment"
          ? (EQUIP_DISPLAY[entry.id.replace(/^equip_/, "")]?.name ?? "").toLowerCase()
          : t(entry.nameKey).toLowerCase();

      // For search, resolve desc via the same function used for rendering
      const desc = resolveEntryDesc(entry, t).toLowerCase();

      return name.includes(q) || desc.includes(q);
    });
  }, [query, activeCategory, t]);

  return (
    <div className="flex flex-col">
      {/* Page title */}
      <div className="px-5 pb-2 pt-6">
        <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
          {t("wiki.title")}
        </h1>
      </div>

      {/* Search bar — sticky beneath SubHeader */}
      <div className="sticky top-14 z-10 bg-background/80 px-5 py-3 backdrop-blur-md">
        <div className="relative flex h-12 items-center">
          <IconSearch
            size={18}
            className="absolute left-4 shrink-0 text-muted/60"
            aria-hidden
          />
          <input
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("wiki.searchPlaceholder")}
            aria-label={t("wiki.searchPlaceholder")}
            className="h-12 w-full rounded-2xl border border-border bg-surface-2/30 pl-10 pr-10 text-sm text-foreground placeholder:text-muted/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-colors duration-150"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t("wiki.clearSearch")}
              className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-full text-muted/60 transition hover:text-foreground active:scale-90"
            >
              <IconX size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category tabs — horizontal scroll, no scrollbar */}
      <div
        className="flex gap-2 overflow-x-auto px-5 pb-3 pt-1 scrollbar-none"
        role="tablist"
        aria-label={t("wiki.tabsLabel")}
      >
        {CATEGORIES.map((cat, index) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              ref={(el) => { tabRefs.current[index] = el; }}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-150 active:scale-[0.96] ${
                isActive
                  ? cat.accentClass
                  : "border-border bg-transparent text-muted hover:border-border-strong hover:text-foreground"
              }`}
            >
              <span aria-hidden>{cat.emoji}</span>
              <span>{t(cat.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div className="px-5 pb-2">
        <p className="text-xs text-muted/60">
          {t("wiki.resultCount", { count: filtered.length })}
        </p>
      </div>

      {/* Grid */}
      <div className="px-5 pb-32" aria-live="polite" aria-atomic="false">
        {filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center gap-5 py-20 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(124,92,196,0.18) 0%, transparent 70%)",
                  filter: "blur(8px)",
                }}
                aria-hidden
              />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-fear/20 bg-surface-2/60">
                <IconBookOff size={28} stroke={1.2} className="text-fear/50" aria-hidden />
              </div>
            </div>
            <div className="max-w-[24ch]">
              <p className="font-display text-base font-semibold text-foreground">
                {t("wiki.noResults")}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {t("wiki.noResultsHint")}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.map((entry) => (
              <WikiCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
