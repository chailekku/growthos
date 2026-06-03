"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, AlertTriangle, TrendingUp, BookOpen, BarChart2,
  GraduationCap, Building2, ArrowUpRight, Heart, Activity,
} from "lucide-react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useI18nStore } from "@/store/i18n-store";
import { useAuthStore } from "@/store/auth-store";
import { translations } from "@/i18n";
import { DEMO_STUDENTS_LIST, DEMO_COURSES, DEMO_SECTIONS } from "@/lib/mock-data";
import { getRiskColor } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line,
} from "recharts";

type ViewMode = "overview" | "by-course" | "by-section";

const ENGAGEMENT_DATA = [
  { week: "สัปดาห์ 1", sec1: 72, sec2: 68 },
  { week: "สัปดาห์ 2", sec1: 75, sec2: 65 },
  { week: "สัปดาห์ 3", sec1: 78, sec2: 70 },
  { week: "สัปดาห์ 4", sec1: 80, sec2: 74 },
];

export default function TeacherDashboard() {
  const { language } = useI18nStore();
  const { user } = useAuthStore();
  const t = translations[language];
  const isTh = language === "th";

  const [viewMode,     setViewMode]     = useState<ViewMode>("overview");
  const [selectedCourse, setSelectedCourse] = useState(DEMO_COURSES[0]?.id || "");

  const myCourses  = DEMO_COURSES.filter(c => c.teacherIds.includes(user?.id || "demo-teacher-1"));
  const allStudents = DEMO_STUDENTS_LIST;
  const atRisk     = allStudents.filter(s => s.riskLevel === "high" || s.riskLevel === "elevated");
  const avgEngagement = Math.round(allStudents.reduce((a, s) => a + s.engagement, 0) / allStudents.length);

  const selectedCourseObj  = DEMO_COURSES.find(c => c.id === selectedCourse);
  const selectedSections   = DEMO_SECTIONS.filter(s => s.courseId === selectedCourse);

  const STAT_CARDS = [
    { label: isTh ? "นักศึกษาทั้งหมด"       : "Total Students",    value: allStudents.length, icon: Users,         color: "text-blue-600",   bg: "bg-blue-50" },
    { label: isTh ? "รายวิชาที่สอน"         : "Courses Taught",    value: myCourses.length || 2, icon: BookOpen,   color: "text-teal-600",   bg: "bg-teal-50" },
    { label: isTh ? "ต้องการความช่วยเหลือ"  : "Need Support",      value: atRisk.length,   icon: AlertTriangle, color: "text-red-600",    bg: "bg-red-50" },
    { label: isTh ? "การมีส่วนร่วมเฉลี่ย"   : "Avg. Engagement",   value: `${avgEngagement}%`, icon: Activity,  color: "text-green-600",  bg: "bg-green-50" },
  ];

  return (
    <AppLayout title={t.teacher.dashboard.title}>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-calm-600 to-teal-600 rounded-3xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 opacity-10">
            <div className="h-48 w-48 rounded-full bg-white -translate-y-16 translate-x-16" />
          </div>
          <div className="relative z-10">
            <p className="text-white/70 text-sm">{t.teacher.dashboard.subtitle}</p>
            <h2 className="text-2xl font-bold mt-1">{user?.displayName}</h2>
            <div className="flex gap-2 mt-3 flex-wrap">
              {(["overview", "by-course", "by-section"] as ViewMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all ${viewMode === m ? "bg-white text-calm-700 font-semibold" : "bg-white/20 text-white hover:bg-white/30"}`}
                >
                  {m === "overview"   ? (isTh ? "ภาพรวม"    : "Overview")
                   : m === "by-course" ? (isTh ? "รายวิชา"  : "By Course")
                   :                     (isTh ? "รายกลุ่ม" : "By Section")}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`h-10 w-10 ${c.bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${c.color}`} />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{c.value}</p>
                      <p className="text-xs text-gray-500">{c.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* View: Overview */}
        {viewMode === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Engagement Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">{isTh ? "แนวโน้มการมีส่วนร่วมรายสัปดาห์" : "Weekly Engagement Trend"}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={ENGAGEMENT_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} formatter={(v) => [`${v}%`]} />
                    <Legend />
                    <Line type="monotone" dataKey="sec1" stroke="#0d9488" strokeWidth={2} dot={{ r: 4 }} name={isTh ? "กลุ่ม 001" : "Section 001"} />
                    <Line type="monotone" dataKey="sec2" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name={isTh ? "กลุ่ม 002" : "Section 002"} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* At-Risk Students */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    {isTh ? "ต้องการความช่วยเหลือ" : "Need Support"}
                  </CardTitle>
                  <Link href="/teacher/students">
                    <Button variant="ghost" size="sm" className="text-xs">
                      {isTh ? "ดูทั้งหมด" : "View all"}
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {atRisk.slice(0, 4).map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">{isTh ? `ใช้งานล่าสุด ${s.lastActive}` : `Last active ${s.lastActive}`}</p>
                    </div>
                    <Badge
                      variant={s.riskLevel === "high" ? "destructive" : "warning"}
                      className="text-xs"
                    >
                      {s.riskLevel === "high" ? (isTh ? "เสี่ยงสูง" : "High Risk") : (isTh ? "เสี่ยง" : "At Risk")}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* View: By Course */}
        {viewMode === "by-course" && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {DEMO_COURSES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourse(c.id)}
                  className={`text-xs px-3 py-2 rounded-xl font-medium transition-all border ${
                    selectedCourse === c.id ? "bg-calm-600 text-white border-calm-600" : "bg-white text-gray-600 border-gray-200 hover:border-calm-300"
                  }`}
                >
                  {c.code} — {isTh ? c.name.substring(0, 20) : c.nameEn.substring(0, 20)}
                </button>
              ))}
            </div>

            {selectedCourseObj && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div>
                      <CardTitle className="text-base">{isTh ? selectedCourseObj.name : selectedCourseObj.nameEn}</CardTitle>
                      <p className="text-xs text-gray-400 mt-0.5">{selectedCourseObj.code} · {selectedCourseObj.credits} {isTh ? "หน่วยกิต" : "credits"} · {selectedSections.length} {isTh ? "กลุ่ม" : "sections"}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {DEMO_STUDENTS_LIST.filter(s => selectedCourseObj.enrolledStudents.includes(s.sectionId)).slice(0, 5).concat(DEMO_STUDENTS_LIST.slice(0, 5)).slice(0, 5).map((s, i) => (
                        <div key={s.id} className="flex items-center gap-4">
                          <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">{s.name.charAt(0)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                              <span className="text-xs font-semibold text-gray-700 ml-2">{s.engagement}%</span>
                            </div>
                            <Progress value={s.engagement} className="h-1.5 mt-1" indicatorClassName={s.engagement > 70 ? "bg-green-400" : s.engagement > 40 ? "bg-yellow-400" : "bg-red-400"} />
                          </div>
                          <Badge variant={s.riskLevel === "low" ? "secondary" : s.riskLevel === "high" ? "destructive" : "warning"} className="text-xs shrink-0">
                            {s.riskLevel}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-base">{isTh ? "สรุปรายวิชา" : "Course Summary"}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: isTh ? "นักศึกษาทั้งหมด" : "Students",       value: selectedCourseObj.enrolledStudents.length, color: "bg-blue-400" },
                      { label: isTh ? "กลุ่มเรียน"      : "Sections",        value: selectedSections.length,                   color: "bg-purple-400" },
                      { label: isTh ? "มีส่วนร่วมเฉลี่ย" : "Avg Engagement", value: "74%",                                      color: "bg-green-400" },
                      { label: isTh ? "ต้องการช่วยเหลือ" : "Need Support",   value: atRisk.length,                              color: "bg-red-400" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${item.color}`} />
                          <span className="text-sm text-gray-600">{item.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* View: By Section */}
        {viewMode === "by-section" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {DEMO_SECTIONS.map((sec, i) => {
              const course    = DEMO_COURSES.find(c => c.id === sec.courseId);
              const secStudents = DEMO_STUDENTS_LIST.filter(s => s.sectionId === sec.id);
              const secAvgEngagement = secStudents.length
                ? Math.round(secStudents.reduce((a, s) => a + s.engagement, 0) / secStudents.length)
                : 0;
              const secAtRisk = secStudents.filter(s => s.riskLevel === "high" || s.riskLevel === "elevated");

              return (
                <motion.div key={sec.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs">{course?.code}</Badge>
                            <Badge className="text-xs bg-calm-100 text-calm-700">
                              {isTh ? `กลุ่ม ${sec.sectionNumber}` : `Sec ${sec.sectionNumber}`}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-gray-700 mt-1">{isTh ? course?.name : course?.nameEn}</p>
                        </div>
                        <Link href="/teacher/students">
                          <Button variant="ghost" size="sm" className="text-xs gap-1">
                            {isTh ? "ดูรายละเอียด" : "Details"} <ArrowUpRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-blue-50 rounded-xl p-2">
                          <p className="text-lg font-bold text-blue-700">{sec.enrolledStudents.length}</p>
                          <p className="text-[10px] text-blue-600">{isTh ? "นักศึกษา" : "Students"}</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-2">
                          <p className="text-lg font-bold text-green-700">{secAvgEngagement}%</p>
                          <p className="text-[10px] text-green-600">{isTh ? "มีส่วนร่วม" : "Engagement"}</p>
                        </div>
                        <div className={`${secAtRisk.length > 0 ? "bg-red-50" : "bg-gray-50"} rounded-xl p-2`}>
                          <p className={`text-lg font-bold ${secAtRisk.length > 0 ? "text-red-600" : "text-gray-500"}`}>{secAtRisk.length}</p>
                          <p className={`text-[10px] ${secAtRisk.length > 0 ? "text-red-500" : "text-gray-400"}`}>{isTh ? "ต้องการช่วย" : "At Risk"}</p>
                        </div>
                      </div>
                      {sec.schedule && (
                        <p className="text-xs text-gray-400 text-center">{sec.schedule} · {isTh ? `ห้อง ${sec.room}` : `Room ${sec.room}`}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Recent Students (always visible in overview) */}
        {viewMode === "overview" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{t.teacher.students.title}</CardTitle>
                <Link href="/teacher/students">
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    {isTh ? "ดูทั้งหมด" : "View all"} <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {[isTh ? "ชื่อ" : "Name", isTh ? "ใช้งานล่าสุด" : "Last Active", isTh ? "มีส่วนร่วม" : "Engagement", isTh ? "สะท้อนคิด" : "Reflections", isTh ? "ระดับความเสี่ยง" : "Risk"].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-400 py-2 pr-4 first:pl-0">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allStudents.slice(0, 6).map((s, i) => (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-gray-50 hover:bg-gray-50"
                      >
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-calm-100 flex items-center justify-center text-xs font-bold text-calm-700 shrink-0">{s.name.charAt(0)}</div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{s.name}</p>
                              <p className="text-xs text-gray-400">{s.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-sm text-gray-500">{s.lastActive}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <Progress value={s.engagement} className="h-1.5 w-20" indicatorClassName={s.engagement > 70 ? "bg-green-400" : s.engagement > 40 ? "bg-yellow-400" : "bg-red-400"} />
                            <span className="text-xs text-gray-600">{s.engagement}%</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-sm text-gray-600">{s.reflections}</td>
                        <td className="py-3">
                          <Badge variant={s.riskLevel === "low" ? "secondary" : s.riskLevel === "high" ? "destructive" : "warning"} className="text-xs">
                            {s.riskLevel === "low" ? (isTh ? "ต่ำ" : "Low") : s.riskLevel === "high" ? (isTh ? "สูง" : "High") : s.riskLevel === "elevated" ? (isTh ? "สูงกว่าปกติ" : "Elevated") : (isTh ? "ปานกลาง" : "Moderate")}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </AppLayout>
  );
}
