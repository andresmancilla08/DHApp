"use client";

import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/AppHeader";

export function HomeContent({ username }: { username: string }) {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-dvh flex-col text-foreground">
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />

      <AppHeader username={username} />

      <main className="dh-rise z-10 flex flex-1 flex-col items-center justify-center gap-5 px-6 py-10 text-center">
        <h1 className="max-w-[18ch] font-display text-3xl font-semibold leading-tight sm:text-4xl">
          {t("home.title")}
        </h1>
        <p className="max-w-[32ch] text-base leading-relaxed text-muted sm:text-lg">
          {t("home.subtitle")}
        </p>
        <button
          type="button"
          className="mt-1 h-12 rounded-full bg-gradient-to-b from-gold-bright to-gold px-7 font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition hover:brightness-105 active:scale-[0.99]"
        >
          {t("home.cta")}
        </button>
      </main>

      <footer className="pb-safe z-10 px-6 pt-2 text-center text-xs text-muted/50">
        {t("app.tagline")}
      </footer>
    </div>
  );
}
