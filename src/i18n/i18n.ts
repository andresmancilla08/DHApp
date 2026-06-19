import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import es from "./locales/es.json";
import { defaultLocale, locales, normalizeLocale } from "./config";

// ponytail: singleton instance, shared across SSR requests. Fine for this app's
// traffic; if multi-tenant SSR concurrency ever matters, switch to per-request instances.
export function initI18n(lng?: string) {
  const lang = normalizeLocale(lng);

  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      resources: {
        en: { translation: en },
        es: { translation: es },
      },
      lng: lang,
      fallbackLng: defaultLocale,
      supportedLngs: locales as unknown as string[],
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
  } else if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }

  return i18n;
}

export default i18n;
