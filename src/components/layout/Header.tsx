"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Menu, X, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { Avatar } from "@/components/ui/avatar";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { DEMO_NOTIFICATIONS } from "@/lib/mock-data";
import { formatTime } from "@/lib/utils";

export function Header({ title }: { title?: string }) {
  const { user } = useAuthStore();
  const { language } = useI18nStore();
  const t = translations[language];
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = DEMO_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-600" />
          <span className="font-bold text-brand-700 text-sm">GrowthOS</span>
        </div>
        {title && (
          <h1 className="hidden md:block text-lg font-semibold text-gray-900">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{t.common.notifications}</h3>
                  <button onClick={() => setShowNotifications(false)} className="p-1 rounded-lg hover:bg-gray-100">
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {DEMO_NOTIFICATIONS.map((n) => (
                    <div key={n.id} className={`p-4 border-b border-gray-50 ${n.isRead ? "opacity-60" : ""}`}>
                      <div className="flex items-start gap-3">
                        <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${n.isRead ? "bg-gray-300" : "bg-brand-500"}`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatTime(n.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {user && (
          <Avatar src={user.avatarUrl} alt={user.displayName} fallback={user.displayName} size="sm" />
        )}
      </div>
    </header>
  );
}
