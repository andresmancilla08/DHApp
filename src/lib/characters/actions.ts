"use server";

import { adminDb } from "@/lib/firebase/admin";
import { getSession } from "@/lib/auth/session";
import { CLASS_DEFS, SUBCLASS_DEFS, type SubclassKey } from "@/lib/daggerheart/classes";
import { ARMOR_BY_ID, WEAPONS_BY_ID } from "@/lib/daggerheart/equipment";
import type { Character, ClassKey, AncestryKey, CommunityKey, CharacterTraits, TraitKey } from "@/lib/daggerheart/types";
import { redirect } from "next/navigation";

export interface CreateCharacterInput {
  name: string;
  pronouns: string;
  classKey: ClassKey;
  subclassKey: SubclassKey;
  ancestryKey: AncestryKey;
  communityKey: CommunityKey;
  traits: CharacterTraits;
  domainCardIds: string[];
  primaryWeaponId: string;
  secondaryWeaponId: string | null;
  armorId: string | null;
  experiences: [string, string];
}

export async function createCharacter(input: CreateCharacterInput): Promise<{ id: string } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: "auth.errors.unknown" };

  const classDef = CLASS_DEFS[input.classKey];
  const subclassDef = SUBCLASS_DEFS[input.subclassKey as SubclassKey];
  const armor = input.armorId ? ARMOR_BY_ID[input.armorId] : null;
  const primaryWeapon = WEAPONS_BY_ID[input.primaryWeaponId];

  // Derive stats from chosen class + equipment
  let evasion = classDef.evasion;
  if (armor?.featureKey === "flexible")  evasion += 1;
  if (armor?.featureKey === "heavy")     evasion -= 1;
  if (armor?.featureKey === "veryHeavy") evasion -= 2;
  if (primaryWeapon?.featureKey === "massive") evasion -= 1;
  if (primaryWeapon?.featureKey === "heavy")   evasion -= 1;

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const pronouns = input.pronouns?.trim() || null;

  const character: Omit<Character, "id"> = {
    userId: session.uid,
    name: input.name.trim(),
    ...(pronouns ? { pronouns } : {}),
    classKey: input.classKey,
    subclassKey: input.subclassKey,
    ancestryKey: input.ancestryKey,
    communityKey: input.communityKey,
    level: 1,
    traits: input.traits,
    evasion,
    hpMax: classDef.hp,
    hpMarked: 0,
    stressMax: 6,
    stressMarked: 0,
    hope: 2,
    proficiency: 1,
    armorScore: armor?.score ?? 0,
    experiences: [
      { id: "exp1", name: input.experiences[0], modifier: 2 },
      { id: "exp2", name: input.experiences[1], modifier: 2 },
    ],
    boostedTraits: [],
    loadout: input.domainCardIds,
    vault: [],
    equipment: {
      weapons: [
        { id: input.primaryWeaponId, slot: "primary" as const },
        ...(input.secondaryWeaponId ? [{ id: input.secondaryWeaponId, slot: "secondary" as const }] : []),
      ],
      armorId: input.armorId,
      itemIds: [],
    },
    backgroundAnswers: {},
    connections: [],
    createdAt: now,
    updatedAt: now,
  };

  await adminDb()
    .collection("users")
    .doc(session.uid)
    .collection("characters")
    .doc(id)
    .set({ ...character, id });

  return { id };
}

export async function listCharacters(): Promise<Character[]> {
  const session = await getSession();
  if (!session) redirect("/login");

  const snap = await adminDb()
    .collection("users")
    .doc(session.uid)
    .collection("characters")
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map((d) => d.data() as Character);
}

export async function getCharacter(id: string): Promise<Character | null> {
  const session = await getSession();
  if (!session) return null;

  const doc = await adminDb()
    .collection("users")
    .doc(session.uid)
    .collection("characters")
    .doc(id)
    .get();

  return doc.exists ? (doc.data() as Character) : null;
}

export type LevelUpAdvancement =
  | { type: "boostTraits"; traits: [TraitKey, TraitKey] }
  | { type: "hp" }
  | { type: "stress" }
  | { type: "experiences"; experienceIds: [string, string] }
  | { type: "domainCard"; cardId: string }
  | { type: "evasion" }
  | { type: "proficiency" };

export async function levelUpCharacter(
  characterId: string,
  advancements: [LevelUpAdvancement, LevelUpAdvancement]
): Promise<{ ok: true } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: "auth.errors.unknown" };

  const uid = session.uid;
  const doc = await adminDb()
    .collection("users")
    .doc(uid)
    .collection("characters")
    .doc(characterId)
    .get();

  if (!doc.exists) return { error: "character.errors.notFound" };

  const character = doc.data() as Character;

  if (character.level >= 10) return { error: "character.errors.maxLevel" };

  const newLevel = character.level + 1;

  // Derive tier from new level
  const newTier: 1 | 2 | 3 | 4 =
    newLevel === 1 ? 1
    : newLevel <= 4 ? 2
    : newLevel <= 7 ? 3
    : 4;

  const now = new Date().toISOString();

  // Mutable copies of arrays/objects we may modify
  let hpMax = character.hpMax;
  let stressMax = character.stressMax;
  let evasion = character.evasion;
  let proficiency = character.proficiency;
  const traits = { ...character.traits };
  const experiences = [...character.experiences];
  const loadout = [...character.loadout];
  let boostedTraits: TraitKey[] = [...(character.boostedTraits ?? [])];

  // Level achievement at levels 2, 5, 8
  if (newLevel === 2 || newLevel === 5 || newLevel === 8) {
    experiences.push({ id: crypto.randomUUID(), name: "New Experience", modifier: 2 });
    proficiency += 1;
    if (newLevel === 5 || newLevel === 8) {
      boostedTraits = [];
    }
  }

  // Apply each advancement
  for (const advancement of advancements) {
    switch (advancement.type) {
      case "hp":
        hpMax += 1;
        break;
      case "stress":
        stressMax += 1;
        break;
      case "evasion":
        evasion += 1;
        break;
      case "proficiency":
        proficiency += 1;
        break;
      case "boostTraits":
        for (const trait of advancement.traits) {
          traits[trait] += 1;
          boostedTraits.push(trait);
        }
        break;
      case "experiences":
        for (const expId of advancement.experienceIds) {
          const idx = experiences.findIndex((e) => e.id === expId);
          if (idx !== -1) {
            experiences[idx] = { ...experiences[idx], modifier: experiences[idx].modifier + 1 };
          }
        }
        break;
      case "domainCard":
        loadout.push(advancement.cardId);
        break;
    }
  }

  const updatePayload: Partial<Character> & { updatedAt: string } = {
    level: newLevel,
    hpMax,
    stressMax,
    evasion,
    proficiency,
    traits,
    experiences,
    loadout,
    boostedTraits,
    updatedAt: now,
  };

  // newTier is derived but we store it so downstream reads are cheap
  // (Character interface doesn't have a tier field currently — omit it)
  void newTier;

  await adminDb()
    .collection("users")
    .doc(uid)
    .collection("characters")
    .doc(characterId)
    .update(updatePayload);

  return { ok: true };
}
