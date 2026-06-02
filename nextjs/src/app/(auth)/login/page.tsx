"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Eye, EyeOff, GraduationCap, BookOpen, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { UserRole } from "@/types";

const DEMO_ROLES: { role: UserRole; labelKey: "student" | "teacher" | "psychologist" | "super_admin"; icon: React.ComponentType<{className?: string}>; color: string }[] = [
  { role: "student", labelKey: "student", icon: GraduationCap, color: "from-brand-500 to-brand-600" },
  { role: "teacher", labelKey: "teacher", icon: BookOpen, color: "from-calm-500 to-calm-600" },
  { role: "psychologist", labelKey: "psychologist", icon: Heart, color: "from-purple-500 to-purple-600" },
  { role: "super_admin", labelKey: "super_admin", icon: Shield, color: "from-gray-600 to-gray-700" },
];

const ROLE_ROUTES: Record<string, string> = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
  psychologist: "/psychologist/dashboard",
  super_admin: "/admin/dashboard",
  system_admin: "/admin/dashboard",
};

export default function LoginPage() {
  const router = useRouter();
  const { demoLogin } = useAuthStore();
  const { language } = useI18nStore();
  const t = translations[language];
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      demoLogin(role);
      router.push(ROLE_ROUTES[role]);
      setIsLoading(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDemoLogin("student");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-purple-700 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${60 + i * 40}px`, height: `${60 + i * 40}px`,
                top: `${10 + i * 15}%`, left: `${5 + i * 12}%`,
                opacity: 0.3,
              }}
            />
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg">Gekku GrowthOS</p>
              <p className="text-white/70 text-sm">Personal Growth Infrastructure</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            {language === "th" ? "เติบโตอย่างมีความหมาย\nในทุกวัน" : "Grow meaningfully,\nevery single day"}
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            {language === "th"
              ? "ระบบ AI ที่ช่วยให้คุณโฟกัส สะท้อนคิด และเติบโตในแบบของคุณเอง"
              : "An AI companion that helps you focus, reflect, and grow your way"
            }
          </p>
          <div className="space-y-3">
            {["🎯 AI Focus System", "📝 Reflection Journal", "📈 Growth Analytics", "🤝 Wellbeing Support"].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="lg:hidden flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-600" />
              <span className="font-bold text-gray-900">GrowthOS</span>
            </div>
            <LanguageSwitcher />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.auth.welcomeBack}</h1>
            <p className="text-gray-500 text-sm mb-6">{t.auth.signInSubtitle}</p>

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth.email}</label>
                <Input
                  type="email"
                  placeholder="you@university.ac.th"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth.password}</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : t.auth.signInButton}
              </Button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400">{t.auth.demoMode}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {DEMO_ROLES.map(({ role, labelKey, icon: Icon, color }) => (
                <motion.button
                  key={role}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDemoLogin(role)}
                  disabled={isLoading}
                  className={`flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r ${color} text-white text-sm font-medium disabled:opacity-60 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <Icon className="h-4 w-4" />
                  {t.auth.roles[labelKey]}
                </motion.button>
              ))}
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              {language === "th"
                ? "โหมดสาธิต: ไม่ต้องใช้บัญชีจริง · ข้อมูลทั้งหมดเป็น Mock Data"
                : "Demo mode: No account needed · All data is simulated"
              }
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
