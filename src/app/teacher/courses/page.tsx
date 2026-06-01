"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { BookOpen } from "lucide-react";

const COURSES = [
  { code: "CS301", name: "Algorithm Analysis", enrolled: 45, engagement: 78, semester: "2/2567" },
  { code: "CS302", name: "Data Structures", enrolled: 38, engagement: 82, semester: "2/2567" },
  { code: "CS401", name: "Software Engineering", enrolled: 32, engagement: 70, semester: "2/2567" },
];

export default function TeacherCoursesPage() {
  const { language } = useI18nStore();
  const t = translations[language];

  return (
    <AppLayout title={t.nav.courses}>
      <div className="space-y-4 max-w-4xl mx-auto">
        {COURSES.map((c) => (
          <Card key={c.code} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-calm-50 flex items-center justify-center shrink-0">
                <BookOpen className="h-6 w-6 text-calm-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-gray-900">{c.code}</p>
                  <p className="text-sm text-gray-600">{c.name}</p>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{language === "th" ? "เทอม" : "Semester"}: {c.semester}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{c.enrolled}</p>
                <p className="text-xs text-gray-400">{language === "th" ? "นักศึกษา" : "students"}</p>
              </div>
              <Badge variant={c.engagement > 75 ? "success" : "warning"}>{c.engagement}% engaged</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
