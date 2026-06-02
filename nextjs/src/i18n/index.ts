"use client";

import { createContext, useContext } from "react";
import en from "./translations/en";
import th from "./translations/th";
import type { Language } from "@/types";

export type Translations = typeof en;

export const translations: Record<Language, Translations> = { en, th };

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

export const I18nContext = createContext<I18nContextType>({
  language: "th",
  setLanguage: () => {},
  t: th,
});

export const useTranslation = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used inside I18nProvider");
  return ctx;
};
