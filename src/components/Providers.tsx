"use client";

import { useEffect, useState } from "react";
import { I18nContext } from "@/i18n";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { Toaster } from "sonner";

function I18nProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useI18nStore();
  const t = translations[language];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <I18nProvider>
      <Toaster richColors position="top-right" />
      {children}
    </I18nProvider>
  );
}
