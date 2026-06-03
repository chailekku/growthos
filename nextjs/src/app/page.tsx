"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen, Timer, TrendingUp, Heart, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const features = [
  { icon: Timer, titleTh: "AI Focus System", titleEn: "AI Focus System", descTh: "Pomodoro อัจฉริยะ ปรับตัวตามพฤติกรรมของคุณ", descEn: "Adaptive Pomodoro that learns your patterns", color: "bg-blue-50 text-blue-600" },
  { icon: BookOpen, titleTh: "สมุดบันทึกสะท้อนคิด", titleEn: "Reflection Journal", descTh: "AI ช่วยตั้งคำถามที่ทำให้คุณเติบโต", descEn: "AI-guided prompts for meaningful self-reflection", color: "bg-purple-50 text-purple-600" },
  { icon: TrendingUp, titleTh: "แดชบอร์ดการเติบโต", titleEn: "Growth Dashboard", descTh: "ติดตามนิสัย เป้าหมาย และความก้าวหน้า", descEn: "Track habits, goals, and personal progress", color: "bg-green-50 text-green-600" },
  { icon: Heart, titleTh: "การสนับสนุนสุขภาวะ", titleEn: "Wellbeing Support", descTh: "ตรวจจับความเสี่ยงและสนับสนุนอย่างเป็นมิตร", descEn: "Ethical burnout detection and gentle support", color: "bg-rose-50 text-rose-600" },
  { icon: Sparkles, titleTh: "โค้ช AI ส่วนตัว", titleEn: "Personal AI Coach", descTh: "โค้ชที่ปรับตัวตามคุณ ไม่ตัดสิน ไม่กดดัน", descEn: "Adaptive, judgment-free coaching companion", color: "bg-amber-50 text-amber-600" },
  { icon: Shield, titleTh: "ความเป็นส่วนตัว", titleEn: "Privacy First", descTh: "คุณควบคุมข้อมูลของคุณเอง", descEn: "You control what data is shared and with whom", color: "bg-teal-50 text-teal-600" },
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { language } = useI18nStore();
  const t = translations[language];

  useEffect(() => {
    if (isAuthenticated && user) {
      const roleRoutes: Record<string, string> = {
        student:      "/student/dashboard",
        teacher:      "/teacher/dashboard",
        psychologist: "/psychologist/dashboard",
        super_admin:  "/admin/dashboard",
      };
      router.replace(roleRoutes[user.role] || "/student/dashboard");
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-brand-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">KKU GrowthOS</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
              {t.common.login}
            </Button>
            <Button size="sm" onClick={() => router.push("/login")}>
              {language === "th" ? "เริ่มต้น" : "Get Started"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            {language === "th" ? "แพลตฟอร์ม AI เพื่อการเติบโตของนักศึกษา" : "AI-Powered Student Growth Platform"}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {language === "th" ? (
              <>
                โครงสร้างพื้นฐาน<br />
                <span className="text-brand-600">การเติบโตส่วนบุคคล</span>
              </>
            ) : (
              <>
                Personal Growth<br />
                <span className="text-brand-600">Infrastructure</span>
              </>
            )}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            {language === "th"
              ? "แพลตฟอร์ม AI ที่ออกแบบมาเพื่อช่วยนักศึกษาเติบโตทางวิชาการ อารมณ์ พฤติกรรม และเป็นผู้นำในอนาคต"
              : "An AI ecosystem designed to help university students grow academically, emotionally, and as future leaders."
            }
          </p>
          <div className="flex gap-3 justify-center">
            <Button size="xl" onClick={() => router.push("/login")} className="gap-2 shadow-glow">
              {language === "th" ? "เริ่มต้นใช้งาน" : "Get Started Free"}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="xl" variant="outline" onClick={() => router.push("/login")}>
              {language === "th" ? "สาธิต" : "View Demo"}
            </Button>
          </div>
        </motion.div>

        {/* Role cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          {[
            { role: "student", label: language === "th" ? "นักศึกษา" : "Student", emoji: "🎓", color: "bg-brand-600" },
            { role: "teacher", label: language === "th" ? "อาจารย์" : "Teacher", emoji: "👩‍🏫", color: "bg-calm-600" },
            { role: "psychologist", label: language === "th" ? "นักจิตวิทยา" : "Psychologist", emoji: "💜", color: "bg-purple-600" },
            { role: "super_admin", label: language === "th" ? "ผู้ดูแลระบบ" : "Admin", emoji: "⚙️", color: "bg-gray-700" },
          ].map(({ role, label, emoji, color }) => (
            <div key={role} className="flex items-center gap-2 bg-white rounded-2xl px-5 py-3 shadow-card border border-gray-100">
              <span className="text-xl">{emoji}</span>
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <Users className={`h-3.5 w-3.5 text-gray-400`} />
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {language === "th" ? "ทุกอย่างที่นักศึกษาต้องการ" : "Everything Students Need"}
          </h2>
          <p className="text-gray-500">
            {language === "th" ? "ระบบครบวงจรที่รวม AI coaching, productivity, และ wellbeing" : "An integrated system combining AI coaching, productivity, and wellbeing"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className={`h-10 w-10 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === "th" ? feature.titleTh : feature.titleEn}
              </h3>
              <p className="text-sm text-gray-500">
                {language === "th" ? feature.descTh : feature.descEn}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-brand-600 to-purple-600 rounded-3xl p-10 text-white">
          <h2 className="text-3xl font-bold mb-3">
            {language === "th" ? "พร้อมเริ่มต้นแล้วหรือยัง?" : "Ready to grow?"}
          </h2>
          <p className="text-white/80 mb-6">
            {language === "th"
              ? "เข้าร่วมกับนักศึกษาหลายพันคนที่กำลังเติบโตด้วย KKU GrowthOS"
              : "Join thousands of students already growing with KKU GrowthOS"
            }
          </p>
          <Button size="xl" variant="outline" className="bg-white text-brand-700 hover:bg-gray-50 border-white" onClick={() => router.push("/login")}>
            {language === "th" ? "เริ่มต้นฟรี" : "Start Free Today"}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <p>© 2025 KKU GrowthOS · Khon Kaen University · {language === "th" ? "ออกแบบด้วยความห่วงใย" : "Designed with care"}</p>
      </footer>
    </div>
  );
}
