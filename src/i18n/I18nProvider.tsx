"use client";

import { I18nextProvider } from "react-i18next";
import { initI18n } from "./i18n";

export function I18nProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: string;
  children: React.ReactNode;
}) {
  const i18n = initI18n(initialLanguage);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
