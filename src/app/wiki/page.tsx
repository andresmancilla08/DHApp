import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { SubHeader } from "@/components/SubHeader";
import { WikiContent } from "@/components/WikiContent";

export default async function WikiPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="relative flex min-h-dvh flex-col text-foreground">
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />
      <SubHeader backHref="/" />
      <main className="relative z-10 flex-1 overflow-y-auto">
        <WikiContent />
      </main>
    </div>
  );
}
