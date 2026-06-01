"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";

const CLASS_DATA = [
  { week: "1", engagement: 70, tasks: 65, reflections: 55 },
  { week: "2", engagement: 75, tasks: 70, reflections: 60 },
  { week: "3", engagement: 68, tasks: 72, reflections: 65 },
  { week: "4", engagement: 82, tasks: 78, reflections: 72 },
];

const MOOD_TREND = [
  { date: "6 วัน", avgMood: 3.2, avgEnergy: 3.5 },
  { date: "5 วัน", avgMood: 3.8, avgEnergy: 3.7 },
  { date: "4 วัน", avgMood: 3.5, avgEnergy: 3.2 },
  { date: "3 วัน", avgMood: 3.1, avgEnergy: 3.0 },
  { date: "2 วัน", avgMood: 3.7, avgEnergy: 3.8 },
  { date: "เมื่อวาน", avgMood: 3.9, avgEnergy: 3.6 },
  { date: "วันนี้", avgMood: 4.0, avgEnergy: 3.8 },
];

export default function TeacherAnalyticsPage() {
  const { language } = useI18nStore();
  const t = translations[language];

  return (
    <AppLayout title={t.teacher.analytics.title}>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">{t.teacher.analytics.engagementTrend}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={CLASS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} label={{ value: "สัปดาห์", position: "insideBottom", offset: -2, fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                  <Legend />
                  <Bar dataKey="engagement" fill="#0d9488" name="Engagement" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tasks" fill="#6366f1" name="Tasks" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reflections" fill="#f97316" name="Reflections" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">{language === "th" ? "แนวโน้มอารมณ์ชั้นเรียน" : "Class Mood Trend"}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={MOOD_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[1, 5]} hide />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                  <Legend />
                  <Line type="monotone" dataKey="avgMood" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name={language === "th" ? "อารมณ์เฉลี่ย" : "Avg Mood"} />
                  <Line type="monotone" dataKey="avgEnergy" stroke="#14b8a6" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 4 }} name={language === "th" ? "พลังงานเฉลี่ย" : "Avg Energy"} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
