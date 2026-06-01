"use client";

import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/StatCard";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { Users, TrendingUp, BookOpen, Timer, Sparkles, Heart } from "lucide-react";
import { DEMO_ADMIN_USER_GROWTH, DEMO_FEATURE_USAGE, DEMO_ADMIN_STATS } from "@/lib/mock-data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

const RISK_PIE = [
  { name: "Low", value: 62, color: "#22c55e" },
  { name: "Moderate", value: 24, color: "#f59e0b" },
  { name: "Elevated", value: 10, color: "#f97316" },
  { name: "High", value: 4, color: "#ef4444" },
];

const MONTHLY_ENGAGEMENT = [
  { month: "ส.ค.", engagement: 65, reflection: 52, focus: 60, ai: 30 },
  { month: "ก.ย.", engagement: 70, reflection: 60, focus: 65, ai: 40 },
  { month: "ต.ค.", engagement: 68, reflection: 65, focus: 70, ai: 48 },
  { month: "พ.ย.", engagement: 75, reflection: 70, focus: 72, ai: 55 },
  { month: "ธ.ค.", engagement: 72, reflection: 68, focus: 75, ai: 60 },
  { month: "ม.ค.", engagement: 78, reflection: 72, focus: 80, ai: 68 },
  { month: "ก.พ.", engagement: 73, reflection: 75, focus: 78, ai: 72 },
];

export default function AdminAnalyticsPage() {
  const { language } = useI18nStore();
  const t = translations[language];
  const stats = DEMO_ADMIN_STATS;

  return (
    <AppLayout title={t.admin.analytics.title}>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={t.admin.dashboard.totalUsers} value={stats.totalUsers.toLocaleString()} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" trend={{ value: 4.2, label: "vs เดือนที่แล้ว" }} delay={0} />
          <StatCard title={t.admin.dashboard.engagement} value={`${stats.engagementRate}%`} icon={TrendingUp} iconColor="text-green-600" iconBg="bg-green-50" trend={{ value: 3.1, label: "vs เดือนที่แล้ว" }} delay={0.05} />
          <StatCard title={language === "th" ? "อัตราการสะท้อนคิด" : "Reflection Rate"} value={`${stats.reflectionCompletionRate}%`} icon={BookOpen} iconColor="text-purple-600" iconBg="bg-purple-50" delay={0.1} />
          <StatCard title={language === "th" ? "โฟกัสเฉลี่ย/วัน" : "Avg Focus/Day"} value={`${stats.averageFocusMinutes}m`} icon={Timer} iconColor="text-brand-600" iconBg="bg-brand-50" delay={0.15} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{language === "th" ? "การมีส่วนร่วมรายเดือน" : "Monthly Engagement"}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={MONTHLY_ENGAGEMENT}>
                    <defs>
                      {["#6366f1", "#0d9488", "#f97316", "#7c3aed"].map((color, i) => (
                        <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                    <Legend />
                    <Area type="monotone" dataKey="engagement" stroke="#6366f1" fill="url(#grad0)" name="Engagement" strokeWidth={2} />
                    <Area type="monotone" dataKey="reflection" stroke="#0d9488" fill="url(#grad1)" name="Reflection" strokeWidth={2} />
                    <Area type="monotone" dataKey="focus" stroke="#f97316" fill="url(#grad2)" name="Focus" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.admin.analytics.riskDistribution}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={RISK_PIE} cx="50%" cy="50%" outerRadius={65} paddingAngle={3} dataKey="value">
                      {RISK_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ borderRadius: "12px", border: "none" }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.admin.analytics.featureUsage}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {DEMO_FEATURE_USAGE.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{item.feature}</span><span className="font-medium">{item.usage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-brand-500 transition-all duration-700" style={{ width: `${item.usage}%` }} />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
