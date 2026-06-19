import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Already signed in → no reason to see auth screens.
  if (await getSession()) redirect("/");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-10">
      {/* Backdrop layers sit behind content (fixed, z-index -1) and never catch pointer events. */}
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />
      <div className="absolute right-5 top-5 z-10">
        <LocaleSwitcher />
      </div>
      <div className="dh-rise z-10 w-full max-w-sm">{children}</div>
    </div>
  );
}
