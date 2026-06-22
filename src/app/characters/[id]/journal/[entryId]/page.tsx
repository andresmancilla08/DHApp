import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getCharacter } from "@/lib/characters/actions";
import { SubHeader } from "@/components/SubHeader";
import { JournalEntryClient } from "@/components/JournalEntryClient";

interface Props {
  params: Promise<{ id: string; entryId: string }>;
}

export default async function JournalEntryPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id, entryId } = await params;
  const character = await getCharacter(id);
  if (!character) notFound();

  const entry = (character.journal ?? []).find((e) => e.id === entryId);
  if (!entry) redirect(`/characters/${id}/journal`);

  return (
    <div className="relative flex h-app flex-col overflow-hidden text-foreground">
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />
      <SubHeader backHref={`/characters/${id}/journal`} />
      <JournalEntryClient characterId={id} entry={entry} />
    </div>
  );
}
