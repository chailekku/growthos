"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { Building2, Plus } from "lucide-react";

const DEPARTMENTS = [
  { faculty: "วิทยาศาสตร์และเทคโนโลยี", depts: ["วิทยาการคอมพิวเตอร์", "คณิตศาสตร์", "ฟิสิกส์", "เคมี"], students: 320 },
  { faculty: "มนุษยศาสตร์และสังคมศาสตร์", depts: ["ภาษาไทย", "ภาษาอังกฤษ", "ประวัติศาสตร์"], students: 280 },
  { faculty: "บริหารธุรกิจ", depts: ["การบัญชี", "การตลาด", "การเงิน", "บริหารทรัพยากรมนุษย์"], students: 410 },
  { faculty: "วิศวกรรมศาสตร์", depts: ["วิศวกรรมคอมพิวเตอร์", "วิศวกรรมไฟฟ้า", "วิศวกรรมเครื่องกล"], students: 195 },
];

export default function AdminDepartmentsPage() {
  const { language } = useI18nStore();
  const t = translations[language];

  return (
    <AppLayout title={t.nav.departments}>
      <div className="space-y-5 max-w-5xl mx-auto">
        <div className="flex justify-end">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> {language === "th" ? "เพิ่มคณะ/ภาควิชา" : "Add Faculty/Dept"}
          </Button>
        </div>
        {DEPARTMENTS.map((f, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <Building2 className="h-5 w-5" />
                <p className="font-semibold">{f.faculty}</p>
              </div>
              <span className="text-white/80 text-sm">{f.students} {language === "th" ? "นักศึกษา" : "students"}</span>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {f.depts.map((d, j) => (
                  <div key={j} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 text-sm text-gray-700">
                    <span className="h-2 w-2 rounded-full bg-brand-400" />
                    {d}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
