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
    <div className="relative flex h-dvh flex-col overflow-hidden px-5">
      {/* Backdrop layers sit behind content (fixed, z-index -1) and never catch pointer events. */}
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />

      {/* Top bar: language switcher in its own row so it never crowds the card. */}
      <div className="pt-safe z-10 flex shrink-0 justify-end pb-2">
        <LocaleSwitcher />
      </div>

      {/* Card fills the remaining height and centers; only scrolls if it truly
          doesn't fit (very short screens / on-screen keyboard). */}
      <div className="dh-rise z-10 flex min-h-0 flex-1 items-center justify-center overflow-y-auto pb-4">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
