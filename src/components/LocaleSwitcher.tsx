"use client";

import { useTranslation } from "react-i18next";
import { localeNames, locales, LANG_COOKIE, type Locale } from "@/i18n/config";

export function LocaleSwitcher({ fullWidth = false }: { fullWidth?: boolean }) {
  const { i18n } = useTranslation();
  const active = (i18n.resolvedLanguage ?? i18n.language) as Locale;

  function change(locale: Locale) {
    i18n.changeLanguage(locale);
    document.cookie = `${LANG_COOKIE}=${locale};path=/;max-age=${60 * 60 * 24 * 365}`;
    document.documentElement.lang = locale;
  }

  return (
    <div
      className={`inline-flex rounded-full border border-border bg-surface-2/70 p-1 text-sm backdrop-blur-sm ${
        fullWidth ? "flex w-full" : ""
      }`}
    >
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => change(locale)}
          aria-pressed={active === locale}
          className={`rounded-full px-3 py-2 font-medium transition-colors ${
            fullWidth ? "flex-1" : ""
          } ${
            active === locale
              ? "bg-foreground text-[#1a1410]"
              : "text-muted hover:text-foreground"
          }`}
        >
          {localeNames[locale]}
        </button>
      ))}
    </div>
  );
}
