"use client";

import { useState } from "react";
import { CharacterSheetClient } from "@/components/CharacterSheetClient";
import { LevelUpFlow } from "@/components/LevelUpFlow";
import type { Character } from "@/lib/daggerheart/types";

interface Props {
  character: Character;
}

export function CharacterPageClient({ character }: Props) {
  const [levelUpOpen, setLevelUpOpen] = useState(false);

  return (
    <>
      <CharacterSheetClient
        character={character}
        onLevelUp={character.level < 10 ? () => setLevelUpOpen(true) : undefined}
      />
      <LevelUpFlow
        key={levelUpOpen ? `flow-${character.id}` : "closed"}
        character={character}
        open={levelUpOpen}
        onClose={() => setLevelUpOpen(false)}
      />
    </>
  );
}
