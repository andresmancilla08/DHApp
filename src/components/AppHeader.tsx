import Image from "next/image";
import Link from "next/link";
import { AppMenu } from "@/components/AppMenu";

/** Sticky, safe-area-aware top bar: brand left, account menu right. */
export function AppHeader({ username }: { username: string }) {
  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-screen-md items-center justify-between px-4 py-[10px]">
        <Link href="/" aria-label="Inicio" className="flex h-11 w-11 items-center justify-center">
          <Image src="/logo-sm.png" alt="GrimHeart" width={44} height={44} priority className="h-11 w-11 object-contain" />
        </Link>
        <AppMenu username={username} />
      </div>
    </header>
  );
}
