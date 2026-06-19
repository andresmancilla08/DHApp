import Image from "next/image";
import { AppMenu } from "@/components/AppMenu";

/** Sticky, safe-area-aware top bar: brand left, account menu right. */
export function AppHeader({ username }: { username: string }) {
  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-screen-md items-center justify-between px-4 pb-2">
        <div className="flex items-center gap-2">
          <Image src="/logo-sm.png" alt="" width={34} height={34} priority />
          <span className="font-display text-lg font-semibold tracking-wide text-foreground">GrimHeart</span>
        </div>
        <AppMenu username={username} />
      </div>
    </header>
  );
}
