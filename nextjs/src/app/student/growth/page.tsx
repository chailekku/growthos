"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, Zap, Plus, CheckCircle, Circle, Flame } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/StatCard";
import { AIInsightCard } from "@/components/shared/AIInsightCard";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { DEMO_HABITS, DEMO_GOALS, DEMO_MOOD_TREND } from "@/lib/mock-data";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

const GROWTH_DIMENSIONS = [
  { subject: "วิชาการ", value: 82, fullMark: 100 },
  { subject: "สุขภาพ", value: 75, fullMark: 100 },
  { subject: "การโฟกัส", value: 88, fullMark: 100 },
  { subject: "สังคม", value: 60, fullMark: 100 },
  { subject: "อารมณ์", value: 72, fullMark: 100 },
  { subject: "ผู้นำ", value: 65, fullMark: 100 },
];

export default function GrowthPage() {
  const { language } = useI18nStore();
  const t = translations[language];
  const [habits, setHabits] = useState(DEMO_HABITS);
  const [activeTab, setActiveTab] = useState<"habits" | "goals" | "insights">("habits");

  const toggleHabit = (id: string) => {
    setHabits((prev) => prev.map((h) =>
      h.id === id
        ? { ...h, currentStreak: h.currentStreak + 1, completionDates: [...h.completionDates, new Date()] }
        : h
    ));
  };

  const avgStreak = Math.round(habits.reduce((acc, h) => acc + h.currentStreak, 0) / habits.length);
  const goalCompletionRate = Math.round(DEMO_GOALS.reduce((acc, g) => acc + g.progress, 0) / DEMO_GOALS.length);

  return (
    <AppLayout title={t.student.growth.title}>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={t.student.growth.habitConsistency} value={`${avgStreak} วัน`} subtitle="เฉลี่ย streak" icon={Flame} iconColor="text-orange-600" iconBg="bg-orange-50" delay={0} />
          <StatCard title={t.student.growth.goalCompletion} value={`${goalCompletionRate}%`} subtitle={`${DEMO_GOALS.length} เป้าหมาย`} icon={Target} iconColor="text-blue-600" iconBg="bg-blue-50" delay={0.05} />
          <StatCard title={t.student.growth.focusQuality} value="88%" subtitle="7 วันที่ผ่านมา" icon={Zap} iconColor="text-brand-600" iconBg="bg-brand-50" delay={0.1} />
          <StatCard title={t.student.growth.growthScore} value="76/100" subtitle="ดีขึ้น +8 คะแนน" icon={TrendingUp} iconColor="text-green-600" iconBg="bg-green-50" trend={{ value: 8, label: "vs เดือนที่แล้ว" }} delay={0.15} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: "habits", label: t.student.growth.habits },
            { key: "goals", label: t.student.growth.goals },
            { key: "insights", label: t.student.growth.insights },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as "habits" | "goals" | "insights")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === key ? "bg-brand-600 text-white shadow-sm" : "bg-white text-gray-600 shadow-card hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {activeTab === "habits" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{t.student.growth.habits}</CardTitle>
                    <Button variant="soft" size="sm" className="gap-1 text-xs">
                      <Plus className="h-3.5 w-3.5" /> {t.student.growth.addHabit}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {habits.map((habit, i) => {
                    const todayDone = habit.completionDates.some(
                      (d) => d.toDateString() === new Date().toDateString()
                    );
                    return (
                      <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-2xl flex items-center justify-center text-xl" style={{ backgroundColor: habit.color + "20" }}>
                          {habit.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{habit.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500">
                              🔥 {habit.currentStreak} {language === "th" ? "วัน" : "days"}
                            </span>
                            <span className="text-xs text-gray-400">
                              {language === "th" ? "สูงสุด" : "Best"}: {habit.longestStreak}
                            </span>
                          </div>
                          <div className="flex mt-2 gap-1">
                            {[...Array(7)].map((_, j) => (
                              <div key={j} className="h-2 flex-1 rounded-full" style={{
                                backgroundColor: j < habit.currentStreak ? habit.color : "#e5e7eb"
                              }} />
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleHabit(habit.id)}
                          className="shrink-0"
                        >
                          {todayDone
                            ? <CheckCircle className="h-7 w-7 text-green-500" />
                            : <Circle className="h-7 w-7 text-gray-300 hover:text-brand-400 transition-colors" />
                          }
                        </button>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {activeTab === "goals" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{t.student.growth.goals}</CardTitle>
                    <Button variant="soft" size="sm" className="gap-1 text-xs">
                      <Plus className="h-3.5 w-3.5" /> {t.student.growth.addGoal}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {DEMO_GOALS.map((goal, i) => (
                    <motion.div key={goal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                      <div className="p-4 rounded-2xl bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{goal.title}</p>
                            <Badge variant={goal.category === "academic" ? "default" : "calm"} className="mt-1 text-xs">
                              {t.student.tasks.category[goal.category as keyof typeof t.student.tasks.category]}
                            </Badge>
                          </div>
                          <span className="text-lg font-bold text-brand-600">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2 mb-3" />
                        <div className="space-y-1.5">
                          {goal.milestones.map((m) => (
                            <div key={m.id} className="flex items-center gap-2 text-xs">
                              {m.completed
                                ? <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                : <Circle className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                              }
                              <span className={m.completed ? "line-through text-gray-400" : "text-gray-600"}>{m.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === "insights" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{language === "th" ? "ข้อมูลเชิงลึกการเติบโต" : "Growth Insights"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">{language === "th" ? "แนวโน้มอารมณ์ 7 วัน" : "7-Day Mood Trend"}</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={DEMO_MOOD_TREND}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[1, 5]} hide />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "12px" }} />
                      <Line type="monotone" dataKey="mood" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 4 }} name={language === "th" ? "อารมณ์" : "Mood"} />
                      <Line type="monotone" dataKey="energy" stroke="#14b8a6" strokeWidth={2.5} dot={{ fill: "#14b8a6", r: 4 }} strokeDasharray="4 2" name={language === "th" ? "พลังงาน" : "Energy"} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel */}
          <div className="space-y-5">
            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.student.growth.selfLeadership}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={GROWTH_DIMENSIONS}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <Radar name="Growth" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <AIInsightCard insight="" title={t.student.growth.insights} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
