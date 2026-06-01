"use client";

import { motion } from "framer-motion";
import { Users, Activity, Sparkles, Shield, TrendingUp, Server, AlertTriangle, Database } from "lucide-react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { DEMO_ADMIN_STATS, DEMO_ADMIN_USER_GROWTH, DEMO_FEATURE_USAGE } from "@/lib/mock-data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from "recharts";

const SYSTEM_STATUS = [
  { name: "API Server", status: "operational", uptime: 99.97 },
  { name: "Database", status: "operational", uptime: 99.95 },
  { name: "AI Service", status: "degraded", uptime: 97.2 },
  { name: "Auth Service", status: "operational", uptime: 100 },
  { name: "File Storage", status: "operational", uptime: 99.8 },
];

const FACULTY_DATA = [
  { faculty: "วิทยาศาสตร์ฯ", students: 320, engagement: 78, atRisk: 12 },
  { faculty: "มนุษยศาสตร์ฯ", students: 280, engagement: 72, atRisk: 18 },
  { faculty: "บริหารธุรกิจ", students: 410, engagement: 81, atRisk: 8 },
  { faculty: "วิศวกรรม", students: 195, engagement: 68, atRisk: 22 },
];

export default function AdminDashboard() {
  const { language } = useI18nStore();
  const t = translations[language];
  const stats = DEMO_ADMIN_STATS;

  return (
    <AppLayout title={t.admin.dashboard.title}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-sm">{t.admin.dashboard.subtitle}</p>
              <h2 className="text-2xl font-bold mt-1">Gekku GrowthOS Platform</h2>
              <div className="flex items-center gap-2 mt-3">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-white/70">{language === "th" ? "ระบบทำงานปกติ" : "All systems operational"} · {stats.platformUptime}% uptime</span>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-white/50 text-xs">AI Interactions Today</p>
              <p className="text-3xl font-bold">{(stats.aiInteractions / 1000).toFixed(1)}K</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={t.admin.dashboard.totalUsers} value={stats.totalUsers.toLocaleString()} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" trend={{ value: 4.2, label: "vs เดือนที่แล้ว" }} delay={0} />
          <StatCard title={t.admin.dashboard.activeStudents} value={stats.activeStudents.toLocaleString()} subtitle="71.5% of total" icon={Activity} iconColor="text-green-600" iconBg="bg-green-50" delay={0.05} />
          <StatCard title={t.admin.dashboard.engagement} value={`${stats.engagementRate}%`} icon={TrendingUp} iconColor="text-brand-600" iconBg="bg-brand-50" trend={{ value: 3.1, label: "vs เดือนที่แล้ว" }} delay={0.1} />
          <StatCard title={t.admin.dashboard.aiUsage} value={`${(stats.aiInteractions / 1000).toFixed(1)}K`} subtitle="รายวัน" icon={Sparkles} iconColor="text-purple-600" iconBg="bg-purple-50" delay={0.15} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Growth Chart */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{t.admin.analytics.userGrowth}</CardTitle>
                  <Link href="/admin/analytics">
                    <Button variant="ghost" size="sm" className="text-xs">{language === "th" ? "ดูทั้งหมด" : "View All"}</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={DEMO_ADMIN_USER_GROWTH}>
                    <defs>
                      <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                    <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} fill="url(#userGrad)" name={language === "th" ? "ผู้ใช้ทั้งหมด" : "Total Users"} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Faculty Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.admin.analytics.facultyPerformance}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {FACULTY_DATA.map((faculty, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-28 shrink-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{faculty.faculty}</p>
                        <p className="text-xs text-gray-400">{faculty.students} {language === "th" ? "คน" : "students"}</p>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">engagement</span>
                          <span className="text-xs font-medium">{faculty.engagement}%</span>
                        </div>
                        <Progress value={faculty.engagement} className="h-1.5" indicatorClassName={
                          faculty.engagement > 75 ? "bg-green-500" :
                          faculty.engagement > 65 ? "bg-yellow-500" : "bg-red-400"
                        } />
                      </div>
                      <Badge variant={faculty.atRisk > 15 ? "destructive" : "warning"} className="text-xs shrink-0">
                        ⚠️ {faculty.atRisk}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-5">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Server className="h-4 w-4 text-gray-500" />
                  {t.admin.dashboard.systemHealth}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {SYSTEM_STATUS.map((service, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        service.status === "operational" ? "bg-green-400" :
                        service.status === "degraded" ? "bg-yellow-400" : "bg-red-400"
                      }`} />
                      <span className="text-sm text-gray-700">{service.name}</span>
                    </div>
                    <span className={`text-xs font-medium ${
                      service.status === "operational" ? "text-green-600" :
                      service.status === "degraded" ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {service.uptime}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Feature Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.admin.analytics.featureUsage}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={DEMO_FEATURE_USAGE} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="feature" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} formatter={(v) => [`${v}%`, "usage"]} />
                    <Bar dataKey="usage" fill="#6366f1" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm">
                    <Users className="h-4 w-4" /> {t.admin.users.title}
                  </Button>
                </Link>
                <Link href="/admin/analytics">
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm">
                    <TrendingUp className="h-4 w-4" /> {t.admin.analytics.title}
                  </Button>
                </Link>
                <Link href="/admin/system">
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm">
                    <Shield className="h-4 w-4" /> {t.admin.system.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
