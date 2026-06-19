// Canonical Daggerheart reference lists (SRD). Display names are resolved via i18n keys
// (e.g. `dh.class.bard`) so the UI stays fully localized in EN/ES.

import type {
  AncestryKey,
  ClassKey,
  CommunityKey,
  DomainKey,
  TraitKey,
} from "./types";

export const TRAITS: TraitKey[] = [
  "agility",
  "strength",
  "finesse",
  "instinct",
  "presence",
  "knowledge",
];

/** Standard array assigned across the six traits at character creation. */
export const TRAIT_ARRAY = [2, 1, 1, 0, 0, -1] as const;

export const DOMAINS: DomainKey[] = [
  "arcana",
  "blade",
  "bone",
  "codex",
  "grace",
  "midnight",
  "sage",
  "splendor",
  "valor",
];

export const ANCESTRIES: AncestryKey[] = [
  "clank",
  "drakona",
  "dwarf",
  "elf",
  "faerie",
  "faun",
  "firbolg",
  "fungril",
  "galapa",
  "giant",
  "goblin",
  "halfling",
  "human",
  "infernis",
  "katari",
  "orc",
  "ribbet",
  "simiah",
];

export const COMMUNITIES: CommunityKey[] = [
  "highborne",
  "loreborne",
  "orderborne",
  "ridgeborne",
  "seaborne",
  "slyborne",
  "underborne",
  "wanderborne",
  "wildborne",
];

/** Each class draws domain cards from exactly two domains. */
export const CLASS_DOMAINS: Record<ClassKey, [DomainKey, DomainKey]> = {
  bard: ["grace", "codex"],
  druid: ["sage", "arcana"],
  guardian: ["valor", "blade"],
  ranger: ["bone", "sage"],
  rogue: ["midnight", "grace"],
  seraph: ["splendor", "valor"],
  sorcerer: ["arcana", "midnight"],
  warrior: ["blade", "bone"],
  wizard: ["codex", "splendor"],
};

export const CLASSES: ClassKey[] = Object.keys(CLASS_DOMAINS) as ClassKey[];

/**
 * Suggested trait distribution per class (CoreBook character guides).
 * Values: +2, +1, +1, 0, 0, -1 distributed across the six traits.
 */
export const CLASS_SUGGESTED_TRAITS: Record<ClassKey, Record<TraitKey, number>> = {
  // Confirmed from CoreBook text extraction
  bard:     { agility: 0,  strength: -1, finesse: 1,  instinct: 0,  presence: 2,  knowledge: 1 },
  sorcerer: { agility: 0,  strength: -1, finesse: 1,  instinct: 2,  presence: 1,  knowledge: 0 },
  // Pending verification from CoreBook PDF — placeholder distributions
  druid:    { agility: 1,  strength: -1, finesse: 0,  instinct: 2,  presence: 1,  knowledge: 0 },
  guardian: { agility: 1,  strength: 2,  finesse: 0,  instinct: 0,  presence: 1,  knowledge: -1 },
  ranger:   { agility: 2,  strength: 1,  finesse: 1,  instinct: 0,  presence: 0,  knowledge: -1 },
  rogue:    { agility: 2,  strength: 0,  finesse: 1,  instinct: 1,  presence: 0,  knowledge: -1 },
  seraph:   { agility: 1,  strength: 2,  finesse: 0,  instinct: 0,  presence: 1,  knowledge: -1 },
  warrior:  { agility: 1,  strength: 2,  finesse: 1,  instinct: 0,  presence: 0,  knowledge: -1 },
  wizard:   { agility: 0,  strength: -1, finesse: 1,  instinct: 0,  presence: 0,  knowledge: 2 },
};

/** Level -> tier mapping. Tiers gate available advancements and card levels. */
export function tierForLevel(level: number): 1 | 2 | 3 | 4 {
  if (level <= 1) return 1;
  if (level <= 4) return 2;
  if (level <= 7) return 3;
  return 4;
}
