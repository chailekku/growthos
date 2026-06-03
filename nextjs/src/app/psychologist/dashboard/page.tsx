"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart, AlertTriangle, TrendingDown, Users, Activity,
  ChevronRight, Shield, Search, User, BarChart2, Building2, GraduationCap,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import {
  DEMO_STUDENTS_LIST, DEMO_FACULTY_DATA, DEMO_COURSES, DEMO_SECTIONS,
  DEMO_WELLBEING_TREND_ADMIN,
} from "@/lib/mock-data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";

type ViewMode = "overview" | "by-faculty" | "by-course" | "by-section" | "individual";

const WELLBEING_DIMENSIONS = [
  { dim: "ความเครียด",    dimEn: "Stress",     value: 58 },
  { dim: "แรงจูงใจ",      dimEn: "Motivation", value: 72 },
  { dim: "การนอนหลับ",    dimEn: "Sleep",      value: 65 },
  { dim: "ความสัมพันธ์",  dimEn: "Social",     value: 78 },
  { dim: "สุขภาวะรวม",   dimEn: "Overall",    value: 70 },
];

export default function PsychologistDashboard() {
  const { language } = useI18nStore();
  const t = translations[language];
  const isTh = language === "th";

  const [viewMode,        setViewMode]        = useState<ViewMode>("overview");
  const [search,          setSearch]          = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const highRisk   = DEMO_STUDENTS_LIST.filter(s => s.riskLevel === "high");
  const elevated   = DEMO_STUDENTS_LIST.filter(s => s.riskLevel === "elevated");
  const improving  = DEMO_STUDENTS_LIST.filter(s => s.engagement > 70 && s.riskLevel === "low");
  const monitored  = DEMO_STUDENTS_LIST.length;

  const selectedStudentData = selectedStudent ? DEMO_STUDENTS_LIST.find(s => s.id === selectedStudent) : null;

  const VIEW_TABS: { key: ViewMode; label: string; icon: React.ElementType }[] = [
    { key: "overview",   label: isTh ? "ภาพรวม"    : "Overview",   icon: BarChart2 },
    { key: "by-faculty", label: isTh ? "รายคณะ"    : "By Faculty", icon: Building2 },
    { key: "by-course",  label: isTh ? "รายวิชา"   : "By Course",  icon: GraduationCap },
    { key: "by-section", label: isTh ? "รายกลุ่ม"  : "By Section", icon: Building2 },
    { key: "individual", label: isTh ? "รายบุคคล"  : "Individual", icon: User },
  ];

  return (
    <AppLayout title={t.psychologist.dashboard.title}>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-violet-700 rounded-3xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 opacity-10">
            <div className="h-48 w-48 rounded-full bg-white -translate-y-12 translate-x-12" />
          </div>
          <div className="relative z-10">
            <p className="text-white/70 text-sm">{t.psychologist.dashboard.subtitle}</p>
            <h2 className="text-2xl font-bold mt-1">{isTh ? "แดชบอร์ดสุขภาวะ" : "Wellbeing Dashboard"}</h2>
            <p className="text-white/60 text-xs mt-2 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {t.psychologist.dashboard.consentNote}
            </p>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t.psychologist.dashboard.monitored,     value: monitored,       icon: Users,         color: "text-purple-600", bg: "bg-purple-50" },
            { label: t.psychologist.dashboard.highRisk,      value: highRisk.length, icon: AlertTriangle, color: "text-red-600",    bg: "bg-red-50" },
            { label: t.psychologist.dashboard.burnoutAlerts, value: elevated.length, icon: TrendingDown,  color: "text-orange-600", bg: "bg-orange-50" },
            { label: t.psychologist.dashboard.improving,     value: improving.length,icon: Activity,      color: "text-green-600",  bg: "bg-green-50" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`h-10 w-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                      <p className="text-xs text-gray-500">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {VIEW_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => { setViewMode(tab.key); setSelectedStudent(null); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  viewMode === tab.key
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── OVERVIEW ── */}
        {viewMode === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">{isTh ? "แนวโน้มระดับความเสี่ยงรายเดือน" : "Monthly Risk Level Trend"}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={DEMO_WELLBEING_TREND_ADMIN}>
                    <defs>
                      <linearGradient id="gLow" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                      <linearGradient id="gHigh" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} formatter={(v) => [`${v}%`]} />
                    <Area type="monotone" dataKey="low"      stroke="#22c55e" fill="url(#gLow)"  strokeWidth={2} name={isTh ? "ต่ำ" : "Low"} />
                    <Area type="monotone" dataKey="moderate" stroke="#f59e0b" fill="none"         strokeWidth={2} name={isTh ? "ปานกลาง" : "Moderate"} strokeDasharray="4 2" />
                    <Area type="monotone" dataKey="elevated" stroke="#f97316" fill="none"         strokeWidth={2} name={isTh ? "สูงกว่าปกติ" : "Elevated"} strokeDasharray="4 2" />
                    <Area type="monotone" dataKey="high"     stroke="#ef4444" fill="url(#gHigh)" strokeWidth={2} name={isTh ? "สูง" : "High"} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{isTh ? "มิติสุขภาวะเฉลี่ย" : "Avg. Wellbeing Dimensions"}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={WELLBEING_DIMENSIONS}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey={isTh ? "dim" : "dimEn"} tick={{ fontSize: 10, fill: "#6b7280" }} />
                    <Radar dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* High-Risk Table */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    {isTh ? "นักศึกษาที่ต้องการความใส่ใจ" : "Students Needing Attention"}
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => setViewMode("individual")}>
                    {isTh ? "ดูรายบุคคล" : "Individual view"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {[isTh ? "นักศึกษา" : "Student", isTh ? "การมีส่วนร่วม" : "Engagement", isTh ? "สะท้อนคิด" : "Reflections", isTh ? "ใช้งานล่าสุด" : "Last Active", isTh ? "ระดับความเสี่ยง" : "Risk"].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-400 py-2 pr-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...highRisk, ...elevated].slice(0, 6).map((s, i) => (
                        <motion.tr
                          key={s.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.06 }}
                          className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                          onClick={() => { setSelectedStudent(s.id); setViewMode("individual"); }}
                        >
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">{s.name.charAt(0)}</div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{s.name}</p>
                                <p className="text-xs text-gray-400">{s.studentId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <Progress value={s.engagement} className="h-1.5 w-16" indicatorClassName={s.engagement > 60 ? "bg-green-400" : "bg-red-400"} />
                              <span className="text-xs text-gray-600">{s.engagement}%</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-sm text-gray-600">{s.reflections}</td>
                          <td className="py-3 pr-4 text-sm text-gray-500">{s.lastActive}</td>
                          <td className="py-3">
                            <Badge variant={s.riskLevel === "high" ? "destructive" : "warning"} className="text-xs">
                              {s.riskLevel === "high" ? (isTh ? "เสี่ยงสูง" : "High Risk") : (isTh ? "ต้องติดตาม" : "Elevated")}
                            </Badge>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── BY FACULTY ── */}
        {viewMode === "by-faculty" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {DEMO_FACULTY_DATA.map((fac, i) => (
              <motion.div key={fac.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewMode("by-course")}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{isTh ? fac.name : fac.nameEn}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{fac.students} {isTh ? "นักศึกษา" : "students"}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">{isTh ? "การมีส่วนร่วม" : "Engagement"}</span>
                          <span className="font-medium">{fac.engagement}%</span>
                        </div>
                        <Progress value={fac.engagement} className="h-1.5" indicatorClassName={fac.engagement > 75 ? "bg-green-400" : fac.engagement > 65 ? "bg-yellow-400" : "bg-red-400"} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{isTh ? "ต้องการความช่วยเหลือ" : "Needs attention"}</span>
                        <Badge variant={fac.atRisk > 15 ? "destructive" : fac.atRisk > 8 ? "warning" : "secondary"} className="text-xs">
                          {fac.atRisk} {isTh ? "คน" : ""}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── BY COURSE ── */}
        {viewMode === "by-course" && (
          <div className="space-y-4">
            {DEMO_COURSES.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">{course.code}</Badge>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mt-1">{isTh ? course.name : course.nameEn}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {course.enrolledStudents.length} {isTh ? "นักศึกษา" : "students"} · {course.sections.length} {isTh ? "กลุ่ม" : "sections"}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => setViewMode("by-section")}>
                      {isTh ? "ดูกลุ่มเรียน" : "View sections"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── BY SECTION ── */}
        {viewMode === "by-section" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {DEMO_SECTIONS.map((sec, i) => {
              const course      = DEMO_COURSES.find(c => c.id === sec.courseId);
              const secStudents = DEMO_STUDENTS_LIST.filter(s => s.sectionId === sec.id);
              const avgEng      = secStudents.length ? Math.round(secStudents.reduce((a, s) => a + s.engagement, 0) / secStudents.length) : 0;
              const secRisk     = secStudents.filter(s => s.riskLevel !== "low").length;
              return (
                <motion.div key={sec.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-mono text-xs">{course?.code}</Badge>
                        <Badge className="text-xs bg-purple-100 text-purple-700">{isTh ? `กลุ่ม ${sec.sectionNumber}` : `Sec ${sec.sectionNumber}`}</Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-3">{isTh ? course?.name : course?.nameEn}</p>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-blue-50 rounded-xl p-2">
                          <p className="text-lg font-bold text-blue-700">{sec.enrolledStudents.length}</p>
                          <p className="text-[10px] text-blue-500">{isTh ? "นักศึกษา" : "Students"}</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-2">
                          <p className="text-lg font-bold text-green-700">{avgEng}%</p>
                          <p className="text-[10px] text-green-500">{isTh ? "มีส่วนร่วม" : "Engagement"}</p>
                        </div>
                        <div className={`${secRisk > 0 ? "bg-red-50" : "bg-gray-50"} rounded-xl p-2`}>
                          <p className={`text-lg font-bold ${secRisk > 0 ? "text-red-600" : "text-gray-400"}`}>{secRisk}</p>
                          <p className={`text-[10px] ${secRisk > 0 ? "text-red-400" : "text-gray-400"}`}>{isTh ? "เสี่ยง" : "At risk"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── INDIVIDUAL ── */}
        {viewMode === "individual" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student List */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={isTh ? "ค้นหานักศึกษา..." : "Search students..."}
                  className="pl-9"
                />
              </div>
              <div className="space-y-2">
                {DEMO_STUDENTS_LIST
                  .filter(s => !search || s.name.includes(search))
                  .map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStudent(s.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all border ${
                        selectedStudent === s.id ? "bg-purple-50 border-purple-200" : "bg-white border-gray-100 hover:border-purple-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700 shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.studentId}</p>
                        </div>
                        <Badge
                          variant={s.riskLevel === "low" ? "secondary" : s.riskLevel === "high" ? "destructive" : "warning"}
                          className="text-[10px] shrink-0"
                        >
                          {s.riskLevel}
                        </Badge>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Individual Detail */}
            <div className="lg:col-span-2">
              {selectedStudentData ? (
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl font-bold text-purple-700">
                          {selectedStudentData.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{selectedStudentData.name}</h3>
                          <p className="text-sm text-gray-500">{selectedStudentData.studentId}</p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <Badge variant={selectedStudentData.riskLevel === "low" ? "secondary" : selectedStudentData.riskLevel === "high" ? "destructive" : "warning"}>
                              {selectedStudentData.riskLevel === "low" ? (isTh ? "ความเสี่ยงต่ำ" : "Low Risk") : selectedStudentData.riskLevel === "high" ? (isTh ? "เสี่ยงสูง" : "High Risk") : (isTh ? "ต้องติดตาม" : "Elevated")}
                            </Badge>
                            <Badge variant="outline">{isTh ? `ใช้งานล่าสุด: ${selectedStudentData.lastActive}` : `Last active: ${selectedStudentData.lastActive}`}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: isTh ? "การมีส่วนร่วม" : "Engagement",   value: `${selectedStudentData.engagement}%`,                              color: "text-blue-700",   bg: "bg-blue-50" },
                      { label: isTh ? "อัตราทำงาน"    : "Task Rate",     value: `${selectedStudentData.taskRate}%`,                                color: "text-green-700",  bg: "bg-green-50" },
                      { label: isTh ? "สะท้อนคิด"     : "Reflections",   value: `${selectedStudentData.reflections} ${isTh ? "ครั้ง" : "entries"}`, color: "text-purple-700", bg: "bg-purple-50" },
                      { label: isTh ? "ใช้งานล่าสุด"  : "Last Active",   value: selectedStudentData.lastActive,                                    color: "text-teal-700",   bg: "bg-teal-50" },
                    ].map((m, i) => (
                      <Card key={i}>
                        <CardContent className={`p-4 ${m.bg} rounded-2xl`}>
                          <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{m.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{isTh ? "การวิเคราะห์รูปแบบพฤติกรรม (AI)" : "AI Behavioral Pattern Analysis"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedStudentData.riskLevel === "high" && (
                        <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                          <p className="text-sm text-red-800 font-medium">🔴 {isTh ? "รูปแบบที่น่ากังวล" : "Concerning Pattern"}</p>
                          <p className="text-xs text-red-700 mt-1">{isTh ? "การมีส่วนร่วมลดลงต่อเนื่อง ไม่มีการสะท้อนคิด 14+ วัน อาจเป็นสัญญาณของการถอนตัวทางอารมณ์" : "Sustained engagement drop, no reflections for 14+ days — may indicate emotional withdrawal."}</p>
                        </div>
                      )}
                      {selectedStudentData.riskLevel === "elevated" && (
                        <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                          <p className="text-sm text-orange-800 font-medium">🟠 {isTh ? "ควรติดตาม" : "Monitor Closely"}</p>
                          <p className="text-xs text-orange-700 mt-1">{isTh ? "การสะท้อนคิดลดลง ควรสนับสนุนด้วยการพูดคุยเชิงบวก" : "Reflection frequency declining. Gentle outreach recommended."}</p>
                        </div>
                      )}
                      {selectedStudentData.riskLevel === "low" && (
                        <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                          <p className="text-sm text-green-800 font-medium">🟢 {isTh ? "สุขภาวะดี" : "Healthy Pattern"}</p>
                          <p className="text-xs text-green-700 mt-1">{isTh ? "รูปแบบการมีส่วนร่วมและสะท้อนคิดสม่ำเสมอ" : "Consistent engagement and reflection patterns. Continue monitoring."}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 italic">{t.psychologist.wellbeing.disclaimer}</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <div className="text-center">
                    <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{isTh ? "เลือกนักศึกษาเพื่อดูรายละเอียด" : "Select a student to view details"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
