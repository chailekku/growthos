"use client";

import { useI18nStore } from "@/store/i18n-store";

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18nStore();

  return (
    <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
      <button
        onClick={() => setLanguage("th")}
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
          language === "th"
            ? "bg-white text-brand-700 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        TH
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
          language === "en"
            ? "bg-white text-brand-700 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        EN
      </button>
    </div>
  );
}
