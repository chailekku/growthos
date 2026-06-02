"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { DEMO_MOOD_TREND } from "@/lib/mock-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function PsychAnalyticsPage() {
  const { language } = useI18nStore();
  const t = translations[language];

  return (
    <AppLayout title={t.nav.analytics}>
      <div className="space-y-6 max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.psychologist.wellbeing.emotionalTrend}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={DEMO_MOOD_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis domain={[1, 5]} hide />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                <Line type="monotone" dataKey="mood" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: "#7c3aed" }} name={language === "th" ? "อารมณ์เฉลี่ย" : "Avg Mood"} />
                <Line type="monotone" dataKey="energy" stroke="#14b8a6" strokeWidth={2.5} strokeDasharray="4 2" dot={{ r: 4, fill: "#14b8a6" }} name={language === "th" ? "พลังงาน" : "Energy"} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
