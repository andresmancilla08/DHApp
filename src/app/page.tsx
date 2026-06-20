import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { listCharacters } from "@/lib/characters/actions";
import { HomeContent } from "@/components/HomeContent";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/login");

  const characters = await listCharacters();

  return <HomeContent username={session.username} characters={characters} />;
}
