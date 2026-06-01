"use client";

import { motion } from "framer-motion";
import {
  Timer, CheckSquare, Flame, Heart, Sparkles, ArrowRight,
  BookOpen, TrendingUp, Plus, PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/shared/StatCard";
import { MoodTracker } from "@/components/shared/MoodTracker";
import { AIInsightCard } from "@/components/shared/AIInsightCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import {
  DEMO_STUDENT_STATS, DEMO_TASKS, DEMO_WEEKLY_FOCUS_DATA, DEMO_MOOD_TREND,
} from "@/lib/mock-data";
import { getGreeting, getMoodEmoji, formatMinutes } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { language } = useI18nStore();
  const t = translations[language];

  const stats = DEMO_STUDENT_STATS;
  const todayTasks = DEMO_TASKS.filter((t) => t.status !== "completed").slice(0, 4);
  const completedTasks = DEMO_TASKS.filter((t) => t.status === "completed");
  const greeting = getGreeting(language);

  return (
    <AppLayout title={t.student.dashboard.title}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Greeting Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-brand-600 via-brand-700 to-purple-600 rounded-3xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 opacity-10">
            <div className="h-48 w-48 rounded-full bg-white -translate-y-16 translate-x-16" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm">{greeting},</p>
              <h2 className="text-2xl font-bold mt-1">{user?.displayName?.split(" ")[0] || "นักศึกษา"} 👋</h2>
              <p className="text-white/70 mt-1 text-sm">{t.student.dashboard.greeting2}</p>
              <div className="flex items-center gap-3 mt-4">
                <div className="bg-white/20 rounded-xl px-3 py-1.5 text-sm">
                  🔥 {stats.currentStreak} {t.student.dashboard.stats.streak}
                </div>
                <div className="bg-white/20 rounded-xl px-3 py-1.5 text-sm">
                  {getMoodEmoji(stats.currentMood || 3)} อารมณ์: {t.student.mood.levels[(stats.currentMood || 3) as 1 | 2 | 3 | 4 | 5]}
                </div>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-white/60 text-xs">วันนี้</p>
              <p className="text-3xl font-bold">{new Date().getDate()}</p>
              <p className="text-white/80 text-sm">
                {new Date().toLocaleDateString("th-TH", { month: "short", year: "2-digit" })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t.student.dashboard.stats.focusHours}
            value={formatMinutes(stats.todayFocusMinutes)}
            subtitle={`สัปดาห์: ${formatMinutes(stats.weeklyFocusMinutes)}`}
            icon={Timer}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
            trend={{ value: 12, label: "vs เมื่อสัปดาห์" }}
            delay={0}
          />
          <StatCard
            title={t.student.dashboard.stats.tasksCompleted}
            value={`${stats.tasksCompletedToday}/${stats.tasksTotal}`}
            subtitle={`${Math.round((stats.tasksCompletedToday / stats.tasksTotal) * 100)}% เสร็จแล้ว`}
            icon={CheckSquare}
            iconColor="text-green-600"
            iconBg="bg-green-50"
            delay={0.05}
          />
          <StatCard
            title={t.student.dashboard.stats.streak}
            value={`${stats.currentStreak} วัน`}
            subtitle="สถิติสูงสุด: 14 วัน"
            icon={Flame}
            iconColor="text-orange-600"
            iconBg="bg-orange-50"
            delay={0.1}
          />
          <StatCard
            title={t.student.dashboard.stats.wellbeingScore}
            value={`${stats.wellbeingScore}%`}
            subtitle="สัปดาห์นี้ดีขึ้น"
            icon={Heart}
            iconColor="text-rose-600"
            iconBg="bg-rose-50"
            trend={{ value: 5, label: "vs เมื่อสัปดาห์" }}
            delay={0.15}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Tasks & Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Focus Chart */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{t.student.dashboard.weeklyProgress}</CardTitle>
                    <Link href="/student/focus">
                      <Button variant="ghost" size="sm" className="text-brand-600 text-xs">
                        {language === "th" ? "ดูทั้งหมด" : "View all"} <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={DEMO_WEEKLY_FOCUS_DATA}>
                      <defs>
                        <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} unit="m" />
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                        formatter={(v) => [`${v} นาที`, "โฟกัส"]}
                      />
                      <Area type="monotone" dataKey="minutes" stroke="#6366f1" strokeWidth={2} fill="url(#focusGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Today's Tasks */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{t.student.dashboard.todayGoals}</CardTitle>
                    <Link href="/student/tasks">
                      <Button variant="soft" size="sm" className="text-xs gap-1">
                        <Plus className="h-3 w-3" /> {t.common.add}
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {todayTasks.map((task, i) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 group cursor-pointer"
                      >
                        <div className={`h-2 w-2 rounded-full shrink-0 ${
                          task.priority === "urgent" ? "bg-red-500" :
                          task.priority === "high" ? "bg-orange-500" :
                          task.priority === "medium" ? "bg-blue-500" : "bg-gray-300"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                          {task.dueDate && (
                            <p className="text-xs text-gray-400">
                              {task.dueDate.toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                            </p>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[task.priority]}`}>
                          {t.student.tasks.priority[task.priority]}
                        </span>
                      </motion.div>
                    ))}
                    {completedTasks.slice(0, 2).map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl opacity-50">
                        <div className="h-2 w-2 rounded-full bg-green-400 shrink-0" />
                        <p className="text-sm text-gray-500 line-through flex-1 truncate">{task.title}</p>
                        <span className="text-xs text-green-600">✓</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-500">{t.common.today}의 Progress</span>
                      <span className="text-xs font-semibold text-gray-700">
                        {stats.tasksCompletedToday}/{stats.tasksTotal}
                      </span>
                    </div>
                    <Progress value={stats.tasksCompletedToday} max={stats.tasksTotal} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* AI Insight */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <AIInsightCard
                insight=""
                title={t.student.dashboard.aiInsight}
              />
            </motion.div>

            {/* Mood Check-in */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <MoodTracker compact />
            </motion.div>

            {/* Mood Trend */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{language === "th" ? "แนวโน้มอารมณ์ 7 วัน" : "7-Day Mood Trend"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={DEMO_MOOD_TREND}>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[1, 5]} hide />
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "none", fontSize: "12px" }}
                        formatter={(v, name) => [
                          name === "mood" ? getMoodEmoji(v as number) + " " + v : v,
                          name === "mood" ? "อารมณ์" : "พลังงาน",
                        ]}
                      />
                      <Line type="monotone" dataKey="mood" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 3 }} />
                      <Line type="monotone" dataKey="energy" stroke="#14b8a6" strokeWidth={2} dot={{ fill: "#14b8a6", r: 3 }} strokeDasharray="4 2" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.student.dashboard.quickActions}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/student/focus">
                    <Button variant="default" className="w-full justify-start gap-2">
                      <PlayCircle className="h-4 w-4" />
                      {t.student.dashboard.focusToday}
                    </Button>
                  </Link>
                  <Link href="/student/reflection">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <BookOpen className="h-4 w-4" />
                      {t.student.dashboard.reflectToday}
                    </Button>
                  </Link>
                  <Link href="/student/growth">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <TrendingUp className="h-4 w-4" />
                      {language === "th" ? "ดูความก้าวหน้า" : "View Progress"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
