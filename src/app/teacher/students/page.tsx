"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Send, Eye, Filter } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { DEMO_STUDENTS_LIST } from "@/lib/mock-data";

const RISK_LABELS: Record<string, string> = { low: "ปกติ", moderate: "เฝ้าระวัง", elevated: "น่ากังวล", high: "ต้องการความช่วยเหลือ" };

export default function TeacherStudentsPage() {
  const { language } = useI18nStore();
  const t = translations[language];
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const filtered = DEMO_STUDENTS_LIST.filter((s) => {
    if (riskFilter !== "all" && s.riskLevel !== riskFilter) return false;
    if (search && !s.name.includes(search) && !s.studentId.includes(search)) return false;
    return true;
  });

  return (
    <AppLayout title={t.teacher.students.title}>
      <div className="space-y-5 max-w-6xl mx-auto">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder={t.teacher.students.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2">
            {["all", "low", "moderate", "elevated", "high"].map((f) => (
              <button key={f} onClick={() => setRiskFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${riskFilter === f ? "bg-brand-600 text-white" : "bg-white shadow-card text-gray-600"}`}>
                {f === "all" ? (language === "th" ? "ทั้งหมด" : "All") : RISK_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {filtered.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-calm-400 to-calm-600 flex items-center justify-center text-white font-bold shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                        <span className="text-xs text-gray-400">{s.studentId}</span>
                        <Badge variant={s.riskLevel as "low" | "moderate" | "elevated" | "high"}>
                          {RISK_LABELS[s.riskLevel]}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{t.teacher.students.lastActive}: {s.lastActive}</p>
                    </div>
                    <div className="hidden md:grid grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{s.engagement}%</p>
                        <p className="text-xs text-gray-400">{t.teacher.students.engagement}</p>
                        <Progress value={s.engagement} className="h-1 mt-1" indicatorClassName={s.engagement > 70 ? "bg-green-500" : s.engagement > 50 ? "bg-yellow-500" : "bg-red-400"} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{s.reflections}</p>
                        <p className="text-xs text-gray-400">{t.teacher.students.reflections}</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{s.taskRate}%</p>
                        <p className="text-xs text-gray-400">{t.teacher.students.tasks}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="text-xs gap-1">
                        <Eye className="h-3 w-3" /> {t.teacher.students.viewProfile}
                      </Button>
                      <Button variant="calm" size="sm" className="text-xs gap-1">
                        <Send className="h-3 w-3" /> {t.teacher.students.sendSupport}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
