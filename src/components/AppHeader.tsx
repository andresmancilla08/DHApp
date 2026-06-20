import Image from "next/image";
import Link from "next/link";
import { AppMenu } from "@/components/AppMenu";

/** Sticky, safe-area-aware top bar: brand left, account menu right. */
export function AppHeader({ username }: { username: string }) {
  return (
    <header
      className="pt-safe sticky top-0 z-30"
      style={{ background: "radial-gradient(140% 120% at 50% 0%, var(--background) 42%, transparent 100%)" }}
    >
      <div className="mx-auto flex w-full max-w-screen-md items-center justify-between px-4 pb-3 pt-[10px]">
        <Link href="/" aria-label="Inicio" className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full">
          {/* Scaled up so the emblem fills the 44px box like the profile avatar (PNG has transparent padding). */}
          <Image src="/logo-sm.png" alt="GrimHeart" width={62} height={62} priority className="h-[62px] w-[62px] max-w-none object-contain" />
        </Link>
        <AppMenu username={username} />
      </div>
    </header>
  );
}
