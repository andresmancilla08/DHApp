import { DaggerheartMark } from "@/components/auth/DaggerheartMark";
import { AppMenu } from "@/components/AppMenu";

/** Sticky, safe-area-aware top bar: brand left, account menu right. */
export function AppHeader({ username }: { username: string }) {
  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-screen-md items-center justify-between px-4 pb-2">
        <span className="flex items-center gap-2 font-display text-lg font-semibold tracking-wide text-foreground">
          <DaggerheartMark className="h-7 w-7" />
          DHApp
        </span>
        <AppMenu username={username} />
      </div>
    </header>
  );
}
