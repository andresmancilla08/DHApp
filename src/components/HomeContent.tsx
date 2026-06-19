"use client";

import { useTranslation } from "react-i18next";
import { logout } from "@/lib/auth/actions";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { DaggerheartMark } from "@/components/auth/DaggerheartMark";

export function HomeContent() {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-screen flex-col text-foreground">
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />

      <header className="z-10 flex items-center justify-between px-5 py-4 sm:px-6">
        <span className="flex items-center gap-2 font-display text-lg font-semibold tracking-wide">
          <DaggerheartMark className="h-6 w-6" />
          {t("app.name")}
        </span>
        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher />
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-border px-4 py-1.5 text-sm text-muted transition hover:border-border-strong hover:text-foreground"
            >
              {t("nav.signOut")}
            </button>
          </form>
        </div>
      </header>

      <main className="dh-rise z-10 flex flex-1 flex-col items-center justify-center gap-5 px-5 text-center sm:px-6">
        <h1 className="max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-5xl">
          {t("home.title")}
        </h1>
        <p className="max-w-xl text-base text-muted sm:text-lg">{t("home.subtitle")}</p>
        <button
          type="button"
          className="rounded-full bg-gradient-to-b from-gold-bright to-gold px-6 py-3 font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition hover:brightness-105 active:scale-[0.99]"
        >
          {t("home.cta")}
        </button>
      </main>

      <footer className="z-10 px-6 py-4 text-center text-xs text-muted/60">
        {t("app.tagline")}
      </footer>
    </div>
  );
}
