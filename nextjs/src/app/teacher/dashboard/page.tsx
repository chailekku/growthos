"use client";

import { motion } from "framer-motion";
import { Users, AlertTriangle, TrendingUp, BookOpen, Send, MessageCircle } from "lucide-react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useI18nStore } from "@/store/i18n-store";
import { useAuthStore } from "@/store/auth-store";
import { translations } from "@/i18n";
import { DEMO_STUDENTS_LIST } from "@/lib/mock-data";
import { getRiskColor } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const WEEKLY_ENGAGEMENT = [
  { week: "4 สัปดาห์ที่แล้ว", engagement: 65, reflection: 58, focus: 70 },
  { week: "3 สัปดาห์ที่แล้ว", engagement: 72, reflection: 62, focus: 68 },
  { week: "2 สัปดาห์ที่แล้ว", engagement: 68, reflection: 70, focus: 75 },
  { week: "สัปดาห์ที่แล้ว", engagement: 78, reflection: 75, focus: 80 },
];

const RISK_LABEL: Record<string, string> = {
  low: "ปกติ", moderate: "เฝ้าระวัง", elevated: "น่ากังวล", high: "ต้องการความช่วยเหลือ",
};

export default function TeacherDashboard() {
  const { user } = useAuthStore();
  const { language } = useI18nStore();
  const t = translations[language];

  const atRiskCount = DEMO_STUDENTS_LIST.filter((s) => s.riskLevel === "high" || s.riskLevel === "elevated").length;
  const avgEngagement = Math.round(DEMO_STUDENTS_LIST.reduce((acc, s) => acc + s.engagement, 0) / DEMO_STUDENTS_LIST.length);

  return (
    <AppLayout title={t.teacher.dashboard.title}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-calm-600 to-teal-700 rounded-3xl p-6 text-white">
          <p className="text-white/70 text-sm">👋 สวัสดี,</p>
          <h2 className="text-2xl font-bold mt-1">{user?.displayName}</h2>
          <p className="text-white/70 text-sm mt-1">{t.teacher.dashboard.subtitle}</p>
          <div className="flex gap-3 mt-4">
            <div className="bg-white/20 rounded-xl px-3 py-1.5 text-sm">
              📊 {DEMO_STUDENTS_LIST.length} {t.teacher.dashboard.totalStudents}
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-1.5 text-sm">
              ⚠️ {atRiskCount} {t.teacher.dashboard.atRisk}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={t.teacher.dashboard.totalStudents} value={DEMO_STUDENTS_LIST.length} icon={Users} iconColor="text-calm-600" iconBg="bg-calm-50" delay={0} />
          <StatCard title={t.teacher.dashboard.atRisk} value={atRiskCount} subtitle={language === "th" ? "ต้องการความช่วยเหลือ" : "Need support"} icon={AlertTriangle} iconColor="text-orange-600" iconBg="bg-orange-50" delay={0.05} />
          <StatCard title={t.teacher.dashboard.avgEngagement} value={`${avgEngagement}%`} icon={TrendingUp} iconColor="text-green-600" iconBg="bg-green-50" trend={{ value: 8, label: "vs เมื่อสัปดาห์" }} delay={0.1} />
          <StatCard title={t.teacher.dashboard.reflectionRate} value="68%" icon={BookOpen} iconColor="text-purple-600" iconBg="bg-purple-50" delay={0.15} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Engagement Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.teacher.analytics.engagementTrend}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={WEEKLY_ENGAGEMENT}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                    <Legend />
                    <Bar dataKey="engagement" fill="#0d9488" name={language === "th" ? "การมีส่วนร่วม" : "Engagement"} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="reflection" fill="#6366f1" name={language === "th" ? "การสะท้อนคิด" : "Reflection"} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="focus" fill="#f97316" name={language === "th" ? "การโฟกัส" : "Focus"} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* At-Risk Students */}
          <Card className="border-orange-100">
            <CardHeader>
              <CardTitle className="text-base text-orange-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {language === "th" ? "นักศึกษาที่น่ากังวล" : "Students Needing Support"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {DEMO_STUDENTS_LIST.filter((s) => s.riskLevel !== "low").map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 rounded-xl bg-orange-50/50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-400">{language === "th" ? "ใช้งานล่าสุด" : "Last active"}: {student.lastActive}</p>
                  </div>
                  <Badge variant={student.riskLevel as "low" | "moderate" | "elevated" | "high"}>
                    {RISK_LABEL[student.riskLevel]}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Student Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t.teacher.students.title}</CardTitle>
              <Link href="/teacher/students">
                <Button variant="soft" size="sm">{language === "th" ? "ดูทั้งหมด" : "View All"}</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DEMO_STUDENTS_LIST.map((student, i) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-calm-400 to-calm-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                    <p className="text-xs text-gray-400">{student.studentId}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-4">
                    <div className="w-24">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">engagement</span>
                        <span className="text-xs font-medium text-gray-700">{student.engagement}%</span>
                      </div>
                      <Progress value={student.engagement} className="h-1.5" indicatorClassName={
                        student.engagement > 70 ? "bg-green-500" :
                        student.engagement > 50 ? "bg-yellow-500" : "bg-red-400"
                      } />
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{student.lastActive}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={student.riskLevel} className="text-xs hidden sm:flex">
                      {RISK_LABEL[student.riskLevel]}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                      <Send className="h-3 w-3" />
                      {language === "th" ? "ส่งกำลังใจ" : "Encourage"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
