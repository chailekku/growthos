"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Activity, Sparkles, TrendingUp, Server, AlertTriangle,
  GraduationCap, BookMarked, Building2, UserCheck, ArrowUpRight, RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import {
  DEMO_ADMIN_STATS, DEMO_ADMIN_USER_GROWTH, DEMO_FEATURE_USAGE,
  DEMO_FACULTY_DATA, DEMO_WELLBEING_TREND_ADMIN,
} from "@/lib/mock-data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

const SYSTEM_STATUS = [
  { name: "API Server",    status: "operational", uptime: 99.97 },
  { name: "Database",      status: "operational", uptime: 99.95 },
  { name: "AI Service",    status: "degraded",    uptime: 97.20 },
  { name: "Auth Service",  status: "operational", uptime: 100.0 },
  { name: "File Storage",  status: "operational", uptime: 99.80 },
];

const RISK_COLORS = ["#22c55e", "#f59e0b", "#f97316", "#ef4444"];

type Period = "week" | "month" | "semester";

export default function AdminDashboard() {
  const { language } = useI18nStore();
  const t = translations[language];
  const stats = DEMO_ADMIN_STATS;
  const [period, setPeriod] = useState<Period>("month");
  const isTh = language === "th";

  const statCards = [
    { title: isTh ? "ผู้ใช้ทั้งหมด" : "Total Users",        value: stats.totalUsers.toLocaleString(),         sub: isTh ? `นักศึกษา ${stats.activeStudents.toLocaleString()} คน` : `${stats.activeStudents.toLocaleString()} students`,    icon: Users,          color: "text-blue-600",   bg: "bg-blue-50",   trend: +4.2 },
    { title: isTh ? "อาจารย์"       : "Teachers",             value: stats.totalTeachers.toLocaleString(),       sub: isTh ? `${stats.totalCourses} รายวิชา`     : `${stats.totalCourses} courses`,                                        icon: GraduationCap,  color: "text-teal-600",   bg: "bg-teal-50",   trend: +2.1 },
    { title: isTh ? "กลุ่มเรียน"   : "Sections",              value: stats.totalSections.toLocaleString(),       sub: isTh ? `${stats.totalFaculties} คณะ`      : `${stats.totalFaculties} faculties`,                                    icon: Building2,      color: "text-purple-600", bg: "bg-purple-50", trend: 0 },
    { title: isTh ? "นักศึกษาต้องการความช่วยเหลือ" : "At-Risk Students", value: stats.atRiskStudents.toLocaleString(), sub: isTh ? "ต้องการการสนับสนุน" : "Need support", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", trend: -8.3 },
    { title: isTh ? "อัตราการมีส่วนร่วม" : "Engagement Rate", value: `${stats.engagementRate}%`,               sub: isTh ? "ค่าเฉลี่ยรายเดือน" : "Monthly avg",                                                                              icon: Activity,       color: "text-green-600",  bg: "bg-green-50",  trend: +3.1 },
    { title: isTh ? "โต้ตอบ AI"    : "AI Interactions",        value: `${(stats.aiInteractions / 1000).toFixed(1)}K`, sub: isTh ? "วันนี้"       : "Today",                                                                                icon: Sparkles,       color: "text-brand-600",  bg: "bg-brand-50",  trend: +12.5 },
    { title: isTh ? "การสะท้อนคิด" : "Reflection Rate",        value: `${stats.reflectionCompletionRate}%`,      sub: isTh ? "ทำครบวันนี้"  : "Completed today",                                                                           icon: TrendingUp,     color: "text-warmth-600", bg: "bg-warmth-50", trend: +1.8 },
    { title: isTh ? "Uptime ระบบ"  : "System Uptime",           value: `${stats.platformUptime}%`,               sub: isTh ? "30 วันที่ผ่านมา" : "Last 30 days",                                                                           icon: Server,         color: "text-gray-600",   bg: "bg-gray-50",   trend: 0 },
  ];

  const riskData = [
    { name: isTh ? "ต่ำ" : "Low",       value: 65, color: "#22c55e" },
    { name: isTh ? "ปานกลาง" : "Moderate", value: 21, color: "#f59e0b" },
    { name: isTh ? "สูงกว่าปกติ" : "Elevated", value: 10, color: "#f97316" },
    { name: isTh ? "สูง" : "High",      value: 4,  color: "#ef4444" },
  ];

  return (
    <AppLayout title={isTh ? "แดชบอร์ด Super Admin" : "Super Admin Dashboard"}>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-800 via-gray-900 to-slate-800 rounded-3xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 opacity-10">
            <div className="h-64 w-64 rounded-full bg-white -translate-y-20 translate-x-20" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-white/60 text-sm">{isTh ? "ภาพรวมแพลตฟอร์ม KKU GrowthOS" : "KKU GrowthOS Platform Overview"}</p>
              <h2 className="text-2xl font-bold mt-1">Super Admin Dashboard</h2>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-white/70">{isTh ? "ระบบทำงานปกติ" : "Systems operational"} · {stats.platformUptime}% uptime</span>
                </div>
                <Badge variant="outline" className="border-white/30 text-white/80 text-xs">
                  {isTh ? `อัปเดตล่าสุด: ${new Date().toLocaleTimeString("th-TH")}` : `Last updated: ${new Date().toLocaleTimeString("en-US")}`}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(["week", "month", "semester"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all ${period === p ? "bg-white/20 text-white font-medium" : "text-white/50 hover:bg-white/10"}`}
                >
                  {p === "week" ? (isTh ? "สัปดาห์" : "Week") : p === "month" ? (isTh ? "เดือน" : "Month") : (isTh ? "เทอม" : "Semester")}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stat Cards — 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.slice(0, 8).map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`h-9 w-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${card.color}`} />
                      </div>
                      {card.trend !== 0 && (
                        <span className={`text-xs font-semibold ${card.trend > 0 ? "text-green-600" : "text-red-500"}`}>
                          {card.trend > 0 ? "+" : ""}{card.trend}%
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs font-medium text-gray-600 mt-0.5">{card.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Growth — 2/3 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{isTh ? "การเติบโตผู้ใช้รายเดือน" : "Monthly User Growth"}</CardTitle>
                <Link href="/admin/analytics">
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    {isTh ? "ดูทั้งหมด" : "View all"} <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={DEMO_ADMIN_USER_GROWTH}>
                  <defs>
                    <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradTeachers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                  <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={2} fill="url(#gradStudents)" name={isTh ? "นักศึกษา" : "Students"} />
                  <Area type="monotone" dataKey="teachers" stroke="#0d9488" strokeWidth={2} fill="url(#gradTeachers)" name={isTh ? "อาจารย์" : "Teachers"} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Distribution Pie — 1/3 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{isTh ? "การกระจายความเสี่ยงสุขภาวะ" : "Wellbeing Risk Distribution"}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={riskData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {riskData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ borderRadius: "10px", border: "none" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {riskData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-gray-600">{d.name}: <strong>{d.value}%</strong></span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Faculty Performance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{isTh ? "ประสิทธิภาพตามคณะ" : "Performance by Faculty"}</CardTitle>
                <Link href="/admin/analytics">
                  <Button variant="ghost" size="sm" className="text-xs">
                    {isTh ? "รายละเอียด" : "Details"}
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DEMO_FACULTY_DATA.map((fac, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800 truncate">{fac.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-gray-400">{fac.students} {isTh ? "นักศึกษา" : "students"} · {fac.teachers} {isTh ? "อาจารย์" : "teachers"}</p>
                      </div>
                      <div className="mt-1.5">
                        <Progress
                          value={fac.engagement}
                          className="h-1.5"
                          indicatorClassName={
                            fac.engagement > 75 ? "bg-green-500" :
                            fac.engagement > 65 ? "bg-yellow-500" : "bg-red-400"
                          }
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{fac.engagement}%</span>
                    <Badge
                      variant={fac.atRisk > 15 ? "destructive" : fac.atRisk > 8 ? "warning" : "secondary"}
                      className="text-xs whitespace-nowrap"
                    >
                      ⚠️ {fac.atRisk}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Server className="h-4 w-4 text-gray-500" />
                  {isTh ? "สุขภาพระบบ" : "System Health"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {SYSTEM_STATUS.map((svc, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        svc.status === "operational" ? "bg-green-400" :
                        svc.status === "degraded"    ? "bg-yellow-400 animate-pulse" : "bg-red-400"
                      }`} />
                      <span className="text-sm text-gray-700">{svc.name}</span>
                    </div>
                    <span className={`text-xs font-semibold ${
                      svc.status === "operational" ? "text-green-600" :
                      svc.status === "degraded"    ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {svc.uptime}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Feature Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{isTh ? "การใช้งานฟีเจอร์" : "Feature Usage"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {DEMO_FEATURE_USAGE.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-24 shrink-0 truncate">{f.feature}</span>
                      <div className="flex-1">
                        <Progress value={f.usage} className="h-1.5" indicatorClassName="bg-brand-500" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{f.usage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: "/admin/users",    icon: UserCog,       label: isTh ? "จัดการผู้ใช้"  : "Manage Users",    color: "bg-blue-500" },
            { href: "/admin/teachers", icon: GraduationCap, label: isTh ? "จัดการอาจารย์" : "Manage Teachers", color: "bg-teal-500" },
            { href: "/admin/courses",  icon: BookMarked,    label: isTh ? "จัดการรายวิชา" : "Manage Courses",  color: "bg-purple-500" },
            { href: "/admin/sections", icon: Building2,     label: isTh ? "จัดการกลุ่มเรียน" : "Manage Sections", color: "bg-warmth-500" },
          ].map((link, i) => {
            const Icon = link.icon;
            return (
              <Link key={i} href={link.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-card hover:shadow-md transition-all cursor-pointer"
                >
                  <div className={`h-10 w-10 ${link.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{link.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 ml-auto" />
                </motion.div>
              </Link>
            );
          })}
        </div>

      </div>
    </AppLayout>
  );
}
