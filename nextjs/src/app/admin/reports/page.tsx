"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { Download, FileText, BarChart2, Heart, Users } from "lucide-react";

const REPORTS = [
  { icon: BarChart2, titleTh: "รายงานการมีส่วนร่วมรายเดือน", titleEn: "Monthly Engagement Report", format: "CSV/PDF", lastGenerated: "1 มี.ค. 2568" },
  { icon: Heart, titleTh: "รายงานสุขภาวะนักศึกษา", titleEn: "Student Wellbeing Report", format: "PDF", lastGenerated: "28 ก.พ. 2568" },
  { icon: Users, titleTh: "รายงานผู้ใช้งานรายคณะ", titleEn: "Faculty User Report", format: "CSV", lastGenerated: "1 มี.ค. 2568" },
  { icon: FileText, titleTh: "บันทึกการตรวจสอบ (Audit Log)", titleEn: "Audit Log Export", format: "JSON/CSV", lastGenerated: "วันนี้" },
];

export default function AdminReportsPage() {
  const { language } = useI18nStore();
  const t = translations[language];

  return (
    <AppLayout title={t.nav.reports}>
      <div className="space-y-4 max-w-4xl mx-auto">
        {REPORTS.map((r, i) => {
          const Icon = r.icon;
          return (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{language === "th" ? r.titleTh : r.titleEn}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {language === "th" ? "รูปแบบ" : "Format"}: {r.format} · {language === "th" ? "สร้างล่าสุด" : "Last generated"}: {r.lastGenerated}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-1 shrink-0">
                  <Download className="h-3.5 w-3.5" />
                  {language === "th" ? "ดาวน์โหลด" : "Download"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
