"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
  IconChevronRight,
  IconSwords,
  IconBook2,
  type Icon as TablerIcon,
} from "@tabler/icons-react";
import { AppHeader } from "@/components/AppHeader";

interface ModuleDef {
  href: string;
  Icon: TablerIcon;
  labelKey: string;
  descKey: string;
  /** Card gradient + border */
  card: string;
  /** Icon circle bg/border/text */
  iconWrap: string;
  /** Hex used for the ambient icon glow */
  glow: string;
}

const MODULES: ModuleDef[] = [
  {
    href: "/characters",
    Icon: IconSwords,
    labelKey: "home.myCharacters",
    descKey: "home.myCharactersDesc",
    card: "border-gold/25 bg-gradient-to-r from-gold/[0.12] to-gold/[0.02] hover:border-gold/45",
    iconWrap: "border-gold/30 bg-gold/[0.12] text-gold",
    glow: "#d9a441",
  },
  {
    href: "/wiki",
    Icon: IconBook2,
    labelKey: "home.wiki",
    descKey: "home.wikiDesc",
    card: "border-fear/25 bg-gradient-to-r from-fear/[0.14] to-fear/[0.02] hover:border-fear/45",
    iconWrap: "border-fear/30 bg-fear/[0.12] text-fear-bright",
    glow: "#a78bfa",
  },
];

export function HomeContent({ username }: { username: string }) {
  const { t } = useTranslation();

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden text-foreground">
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />

      <AppHeader username={username} />

      {/* Scrollable content */}
      <main className="dh-rise z-10 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pb-4 pt-6">
        {/* Hero — CoreBook cover art */}
        <div className="relative h-52 w-full overflow-hidden rounded-3xl border border-gold/20 bg-background shadow-[0_10px_40px_-16px_rgba(0,0,0,0.85)]">
          <Image
            src="/art/cover.jpg"
            alt="Daggerheart"
            fill
            priority
            className="scale-[1.04]"
            style={{ objectFit: "cover", objectPosition: "center" }}
            sizes="(max-width: 768px) 100vw, 700px"
          />
          {/* Legibility gradients: bottom rise + left wash */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/10 to-transparent" />
          {/* Inner hairline for crisp edge on art */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5" aria-hidden />

          <div className="absolute inset-x-5 bottom-5">
            <span className="mb-1.5 inline-block text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/80">
              {t("home.eyebrow")}
            </span>
            <h1 className="max-w-[20ch] font-display text-xl font-bold leading-[1.15] text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-2xl">
              {t("home.title")}
            </h1>
          </div>
        </div>

        {/* Module cards */}
        <div className="flex flex-col gap-3">
          {MODULES.map((mod, i) => (
            <Link
              key={mod.href}
              href={mod.href}
              style={{ animationDelay: `${i * 50}ms` }}
              className={`dh-rise group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-4 transition-all duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${mod.card}`}
            >
              {/* Ambient icon glow */}
              <div
                className="pointer-events-none absolute -left-6 top-1/2 h-24 w-24 -translate-y-1/2 opacity-50 transition-opacity duration-150 group-hover:opacity-80"
                style={{ background: `radial-gradient(circle, ${mod.glow}26, transparent 70%)` }}
                aria-hidden
              />
              <span
                className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${mod.iconWrap}`}
              >
                <mod.Icon size={24} stroke={1.6} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-semibold tracking-wide text-foreground">
                  {t(mod.labelKey)}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted">{t(mod.descKey)}</p>
              </div>
              <IconChevronRight
                size={18}
                className="shrink-0 text-muted/40 transition-transform duration-150 group-hover:translate-x-1 group-hover:text-muted/70"
              />
            </Link>
          ))}
        </div>

        <footer className="mt-auto pb-1 pt-2 text-center text-xs text-muted/45">
          {t("app.tagline")}
        </footer>
      </main>

      {/* Fixed bottom CTA */}
      <div
        className="z-10 shrink-0 px-5 pt-6"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
      >
        <Link
          href="/characters/new"
          className="flex h-14 items-center justify-center gap-1.5 rounded-full bg-gradient-to-b from-gold-bright to-gold font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition hover:brightness-105 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          + {t("home.cta")}
        </Link>
      </div>
    </div>
  );
}
