"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { DEMO_STUDENTS_LIST } from "@/lib/mock-data";
import { Info, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function WellbeingPage() {
  const { language } = useI18nStore();
  const t = translations[language];

  return (
    <AppLayout title={t.psychologist.wellbeing.title}>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex gap-3">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">{t.psychologist.wellbeing.disclaimer}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{language === "th" ? "รายงานสุขภาวะนักศึกษา (นิรนาม)" : "Student Wellbeing Report (Anonymized)"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {DEMO_STUDENTS_LIST.filter((s) => s.riskLevel !== "low").map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <div className="p-4 rounded-2xl bg-gray-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{language === "th" ? `นักศึกษา ${s.id}` : `Student ${s.id}`}</p>
                      <p className="text-xs text-gray-400">{language === "th" ? "ไม่แสดงชื่อจริงตามนโยบายความเป็นส่วนตัว" : "Name hidden per privacy policy"}</p>
                    </div>
                    <Badge variant={s.riskLevel as "moderate" | "elevated" | "high"}>
                      {t.psychologist.wellbeing.riskLevels[s.riskLevel as keyof typeof t.psychologist.wellbeing.riskLevels]}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white rounded-xl p-2">
                      <p className="text-lg font-bold text-gray-900">{s.engagement}%</p>
                      <p className="text-xs text-gray-400">Engagement</p>
                    </div>
                    <div className="bg-white rounded-xl p-2">
                      <p className="text-lg font-bold text-gray-900">{s.reflections}</p>
                      <p className="text-xs text-gray-400">Reflections</p>
                    </div>
                    <div className="bg-white rounded-xl p-2">
                      <p className="text-sm font-bold text-gray-600">{s.lastActive}</p>
                      <p className="text-xs text-gray-400">Last Active</p>
                    </div>
                  </div>
                  {s.riskLevel === "high" && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                      ⚠️ {t.psychologist.wellbeing.interventionSuggested}: {language === "th" ? "แนะนำให้ติดต่อนักศึกษาโดยตรงผ่านช่องทางที่เหมาะสม" : "Recommend direct outreach through appropriate channels"}
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="h-3.5 w-3.5" /> {t.psychologist.wellbeing.viewStudent}
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
