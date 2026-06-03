"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Building2, Search, Plus, Users, GraduationCap,
  Calendar, MapPin, Edit, Trash2, ChevronDown,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useI18nStore } from "@/store/i18n-store";
import { DEMO_SECTIONS, DEMO_COURSES, DEMO_TEACHERS_LIST } from "@/lib/mock-data";

export default function AdminSectionsPage() {
  const { language } = useI18nStore();
  const isTh = language === "th";

  const [search,        setSearch]        = useState("");
  const [courseFilter,  setCourseFilter]  = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");

  const courseMap  = useMemo(() => Object.fromEntries(DEMO_COURSES.map(c => [c.id, c])), []);
  const teacherMap = useMemo(() => Object.fromEntries(DEMO_TEACHERS_LIST.map(t => [t.id, t])), []);

  const sectionsEnriched = useMemo(() =>
    DEMO_SECTIONS.map(sec => ({
      ...sec,
      course:  courseMap[sec.courseId],
      teacher: teacherMap[sec.teacherId],
      fillRate: Math.round((sec.enrolledStudents.length / sec.maxCapacity) * 100),
    })), [courseMap, teacherMap]);

  const filtered = useMemo(() =>
    sectionsEnriched.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch  = !q || s.course?.code?.toLowerCase().includes(q) || s.sectionNumber.includes(q) || s.teacher?.name?.includes(search);
      const matchCourse  = courseFilter  === "all" || s.courseId  === courseFilter;
      const matchTeacher = teacherFilter === "all" || s.teacherId === teacherFilter;
      return matchSearch && matchCourse && matchTeacher;
    }), [sectionsEnriched, search, courseFilter, teacherFilter]);

  return (
    <AppLayout title={isTh ? "จัดการกลุ่มเรียน" : "Section Management"}>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{isTh ? "จัดการกลุ่มเรียน (Section)" : "Section Management"}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isTh ? `กลุ่มเรียนทั้งหมด ${DEMO_SECTIONS.length} กลุ่ม` : `${DEMO_SECTIONS.length} sections total`}
            </p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {isTh ? "เพิ่มกลุ่มเรียน" : "Add Section"}
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: isTh ? "กลุ่มเรียนทั้งหมด" : "Total Sections",   value: DEMO_SECTIONS.length,   color: "text-purple-600", bg: "bg-purple-50", icon: Building2 },
            { label: isTh ? "นักศึกษาทั้งหมด"   : "Total Students",   value: DEMO_SECTIONS.reduce((a, s) => a + s.enrolledStudents.length, 0), color: "text-blue-600", bg: "bg-blue-50", icon: Users },
            { label: isTh ? "ความจุรวม"         : "Total Capacity",    value: DEMO_SECTIONS.reduce((a, s) => a + s.maxCapacity, 0),           color: "text-teal-600", bg: "bg-teal-50", icon: Building2 },
            { label: isTh ? "อาจารย์ผู้สอน"    : "Assigned Teachers", value: new Set(DEMO_SECTIONS.map(s => s.teacherId)).size,              color: "text-warmth-600", bg: "bg-warmth-50", icon: GraduationCap },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i}>
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
            );
          })}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isTh ? "ค้นหารายวิชา, กลุ่ม, อาจารย์..." : "Search course, section, teacher..."}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-300"
              >
                <option value="all">{isTh ? "ทุกรายวิชา" : "All Courses"}</option>
                {DEMO_COURSES.map((c) => (
                  <option key={c.id} value={c.id}>{c.code} — {isTh ? c.name : c.nameEn}</option>
                ))}
              </select>
              <select
                value={teacherFilter}
                onChange={(e) => setTeacherFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-300"
              >
                <option value="all">{isTh ? "ทุกอาจารย์" : "All Teachers"}</option>
                {DEMO_TEACHERS_LIST.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Section Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((sec, i) => (
            <motion.div
              key={sec.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">{sec.course?.code}</Badge>
                        <Badge className="text-xs bg-purple-100 text-purple-700">
                          {isTh ? `กลุ่ม ${sec.sectionNumber}` : `Section ${sec.sectionNumber}`}
                        </Badge>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mt-1.5">
                        {isTh ? sec.course?.name : sec.course?.nameEn}
                      </h3>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
                        <Edit className="h-3.5 w-3.5 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </Button>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">{isTh ? "นักศึกษา" : "Students"}</span>
                      <span className="text-xs font-semibold text-gray-700">
                        {sec.enrolledStudents.length}/{sec.maxCapacity} {isTh ? "คน" : ""}
                      </span>
                    </div>
                    <Progress
                      value={sec.fillRate}
                      className="h-1.5"
                      indicatorClassName={sec.fillRate > 85 ? "bg-red-400" : sec.fillRate > 70 ? "bg-yellow-400" : "bg-green-400"}
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <GraduationCap className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{sec.teacher?.name || "-"}</span>
                    </div>
                    {sec.schedule && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span>{sec.schedule}</span>
                      </div>
                    )}
                    {sec.room && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span>{isTh ? `ห้อง ${sec.room}` : `Room ${sec.room}`}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-400">
              <Building2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">{isTh ? "ไม่พบกลุ่มเรียนที่ตรงกัน" : "No sections found"}</p>
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
