import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { WikiContent } from "@/components/WikiContent";

export default async function WikiPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden text-foreground">
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />
      <WikiContent />
    </div>
  );
}
