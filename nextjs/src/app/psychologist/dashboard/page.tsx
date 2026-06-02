"use client";

import { motion } from "framer-motion";
import { Heart, AlertTriangle, TrendingDown, Shield, Info } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useI18nStore } from "@/store/i18n-store";
import { useAuthStore } from "@/store/auth-store";
import { translations } from "@/i18n";
import { DEMO_STUDENTS_LIST, DEMO_MOOD_TREND } from "@/lib/mock-data";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const WELLBEING_DISTRIBUTION = [
  { name: "Low Risk", value: 62, color: "#22c55e" },
  { name: "Moderate", value: 24, color: "#f59e0b" },
  { name: "Elevated", value: 10, color: "#f97316" },
  { name: "High Risk", value: 4, color: "#ef4444" },
];

const BURNOUT_INDICATORS = [
  { student: "นักศึกษา A", indicators: ["การมีส่วนร่วมลดลง", "ไม่สะท้อนคิด 5 วัน", "อารมณ์ต่ำต่อเนื่อง"], riskLevel: "high" },
  { student: "นักศึกษา B", indicators: ["งานค้างมาก", "โฟกัสลดลง"], riskLevel: "elevated" },
  { student: "นักศึกษา C", indicators: ["อารมณ์ผันผวน"], riskLevel: "moderate" },
];

export default function PsychologistDashboard() {
  const { user } = useAuthStore();
  const { language } = useI18nStore();
  const t = translations[language];

  const highRiskCount = DEMO_STUDENTS_LIST.filter((s) => s.riskLevel === "high").length;
  const elevatedCount = DEMO_STUDENTS_LIST.filter((s) => s.riskLevel === "elevated").length;
  const improvingCount = DEMO_STUDENTS_LIST.filter((s) => s.engagement > 70).length;

  return (
    <AppLayout title={t.psychologist.dashboard.title}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-700 rounded-3xl p-6 text-white">
          <p className="text-white/70 text-sm">👋 สวัสดี,</p>
          <h2 className="text-2xl font-bold mt-1">{user?.displayName}</h2>
          <p className="text-white/70 text-sm mt-1">{t.psychologist.dashboard.subtitle}</p>
        </div>

        {/* Ethical Notice */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3"
        >
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800">{t.psychologist.privacy.title}</p>
            <p className="text-xs text-blue-600 mt-1">{t.psychologist.dashboard.consentNote}</p>
            <div className="flex gap-3 mt-2 text-xs text-blue-500">
              <span>✓ {t.psychologist.privacy.consentRequired}</span>
              <span>✓ {t.psychologist.privacy.anonymized}</span>
              <span>✓ {t.psychologist.privacy.auditLog}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={t.psychologist.dashboard.monitored} value={DEMO_STUDENTS_LIST.length} icon={Heart} iconColor="text-purple-600" iconBg="bg-purple-50" delay={0} />
          <StatCard title={t.psychologist.dashboard.highRisk} value={highRiskCount + elevatedCount} subtitle={language === "th" ? "ต้องการการแทรกแซง" : "Need intervention"} icon={AlertTriangle} iconColor="text-red-600" iconBg="bg-red-50" delay={0.05} />
          <StatCard title={t.psychologist.dashboard.burnoutAlerts} value={highRiskCount} icon={TrendingDown} iconColor="text-orange-600" iconBg="bg-orange-50" delay={0.1} />
          <StatCard title={t.psychologist.dashboard.improving} value={improvingCount} icon={Heart} iconColor="text-green-600" iconBg="bg-green-50" delay={0.15} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wellbeing Trend */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.psychologist.wellbeing.emotionalTrend}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={DEMO_MOOD_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[1, 5]} hide />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                    <Line type="monotone" dataKey="mood" stroke="#7c3aed" strokeWidth={2} dot={{ fill: "#7c3aed", r: 4 }} name={language === "th" ? "อารมณ์เฉลี่ย" : "Avg Mood"} />
                    <Line type="monotone" dataKey="energy" stroke="#14b8a6" strokeWidth={2} strokeDasharray="4 2" dot={{ fill: "#14b8a6", r: 4 }} name={language === "th" ? "พลังงาน" : "Energy"} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Burnout Indicators */}
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  {t.psychologist.wellbeing.burnoutRisk}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700">{t.psychologist.wellbeing.disclaimer}</p>
                </div>
                {BURNOUT_INDICATORS.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-gray-50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{item.student}</p>
                      <Badge variant={item.riskLevel as "high" | "elevated" | "moderate"}>
                        {t.psychologist.wellbeing.riskLevels[item.riskLevel as keyof typeof t.psychologist.wellbeing.riskLevels]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.indicators.map((ind, j) => (
                        <span key={j} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-lg">
                          {ind}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        {t.psychologist.wellbeing.viewStudent}
                      </Button>
                      {item.riskLevel === "high" && (
                        <Button variant="warmth" size="sm" className="text-xs h-7">
                          {t.psychologist.wellbeing.interventionSuggested}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-5">
            {/* Risk Distribution Pie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{language === "th" ? "การกระจายความเสี่ยง" : "Risk Distribution"}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={WELLBEING_DISTRIBUTION} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                      {WELLBEING_DISTRIBUTION.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ borderRadius: "12px", border: "none" }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Wellbeing Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.psychologist.wellbeing.stressLevels}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: language === "th" ? "ความเครียดเฉลี่ย" : "Avg Stress", value: 45, color: "bg-red-400" },
                  { label: language === "th" ? "แรงจูงใจ" : "Motivation", value: 68, color: "bg-green-400" },
                  { label: language === "th" ? "คุณภาพการนอน" : "Sleep Quality", value: 62, color: "bg-blue-400" },
                  { label: language === "th" ? "ความเชื่อมโยงสังคม" : "Social Connection", value: 58, color: "bg-purple-400" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <Progress value={item.value} indicatorClassName={item.color} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
