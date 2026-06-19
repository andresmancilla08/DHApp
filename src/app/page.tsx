import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { HomeContent } from "@/components/HomeContent";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/login");

  return <HomeContent />;
}
