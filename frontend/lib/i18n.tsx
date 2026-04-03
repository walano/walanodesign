"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

type Lang = "fr" | "en";
type Translations = typeof fr;

const translations: Record<Lang, Translations> = { fr, en };

function detectLang(): Lang {
  if (typeof window === "undefined") return "fr";
  const preferred = navigator.language || "fr";
  return preferred.toLowerCase().startsWith("fr") ? "fr" : "en";
}

interface I18nContextType {
  lang: Lang;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");

  useEffect(() => {
    const l = detectLang();
    setLang(l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let val: any = translations[lang];
      for (const k of keys) {
        val = val?.[k];
      }
      return typeof val === "string" ? val : key;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
