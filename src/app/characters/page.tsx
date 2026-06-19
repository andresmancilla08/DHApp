import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { listCharacters } from "@/lib/characters/actions";
import { SubHeader } from "@/components/SubHeader";
import { CharacterListClient } from "@/components/CharacterListClient";

export default async function CharactersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const characters = await listCharacters();

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden text-foreground">
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />
      <SubHeader backHref="/" />
      <main className="relative z-10 flex-1 overflow-y-auto px-5 py-6">
        <CharacterListClient characters={characters} />
      </main>
    </div>
  );
}
