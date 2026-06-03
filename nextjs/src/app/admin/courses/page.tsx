"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookMarked, Search, Plus, ChevronRight, Users, GraduationCap,
  Building2, Edit, Trash2, Eye, Filter,
} from "lucide-react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useI18nStore } from "@/store/i18n-store";
import { DEMO_COURSES, DEMO_FACULTY_DATA } from "@/lib/mock-data";

export default function AdminCoursesPage() {
  const { language } = useI18nStore();
  const isTh = language === "th";

  const [search,       setSearch]       = useState("");
  const [facultyFilter, setFacultyFilter] = useState("all");

  const filtered = useMemo(() =>
    DEMO_COURSES.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.code.toLowerCase().includes(q) || c.name.includes(q) || c.nameEn.toLowerCase().includes(q);
      const matchFaculty = facultyFilter === "all" || c.facultyId === facultyFilter;
      return matchSearch && matchFaculty;
    }), [search, facultyFilter]);

  return (
    <AppLayout title={isTh ? "จัดการรายวิชา" : "Course Management"}>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{isTh ? "จัดการรายวิชา" : "Course Management"}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isTh ? `รายวิชาทั้งหมด ${DEMO_COURSES.length} วิชา` : `${DEMO_COURSES.length} courses total`}
            </p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {isTh ? "เพิ่มรายวิชา" : "Add Course"}
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: isTh ? "รายวิชาทั้งหมด" : "Total Courses",   value: DEMO_COURSES.length,                                  icon: BookMarked, color: "text-brand-600", bg: "bg-brand-50" },
            { label: isTh ? "กลุ่มเรียน"     : "Total Sections",  value: DEMO_COURSES.reduce((a, c) => a + c.sections.length, 0), icon: Building2,  color: "text-purple-600", bg: "bg-purple-50" },
            { label: isTh ? "นักศึกษา"       : "Enrolled Students", value: DEMO_COURSES.reduce((a, c) => a + c.enrolledStudents.length, 0), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: isTh ? "อาจารย์"        : "Teachers",         value: new Set(DEMO_COURSES.flatMap(c => c.teacherIds)).size,   icon: GraduationCap, color: "text-teal-600", bg: "bg-teal-50" },
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
                placeholder={isTh ? "ค้นหารหัส, ชื่อวิชา..." : "Search course code, name..."}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFacultyFilter("all")}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${facultyFilter === "all" ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600"}`}
              >
                {isTh ? "ทุกคณะ" : "All Faculties"}
              </button>
              {DEMO_FACULTY_DATA.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFacultyFilter(f.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${facultyFilter === f.id ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  {isTh ? f.name.substring(0, 12) + (f.name.length > 12 ? "…" : "") : f.nameEn.substring(0, 14) + "…"}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course Cards */}
        <div className="space-y-4">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs font-mono">{course.code}</Badge>
                        <Badge variant="secondary" className="text-xs">
                          {isTh ? `เทอม ${course.semester}/${course.year}` : `Sem ${course.semester}/${course.year}`}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">{course.credits} {isTh ? "หน่วยกิต" : "credits"}</Badge>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mt-1.5">{isTh ? course.name : course.nameEn}</h3>
                      {isTh && <p className="text-xs text-gray-500 mt-0.5">{course.nameEn}</p>}

                      {/* Stats row */}
                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span>{course.sections.length} {isTh ? "กลุ่มเรียน" : "sections"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{course.enrolledStudents.length} {isTh ? "นักศึกษา" : "students"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                          <span>{course.teacherIds.length} {isTh ? "อาจารย์" : "teacher(s)"}</span>
                        </div>
                      </div>

                      {/* Sections preview */}
                      {course.sections.length > 0 && (
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {course.sections.map((sec) => (
                            <span key={sec.id} className="text-xs bg-gray-100 text-gray-600 rounded-lg px-2 py-1">
                              {isTh ? `กลุ่ม ${sec.sectionNumber}` : `Sec ${sec.sectionNumber}`} · {sec.enrolledStudents.length}/{sec.maxCapacity} {isTh ? "คน" : ""}
                            </span>
                          ))}
                          <Link href="/admin/sections">
                            <span className="text-xs text-brand-600 hover:underline cursor-pointer px-2 py-1">
                              + {isTh ? "จัดการกลุ่มเรียน" : "Manage sections"}
                            </span>
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" title={isTh ? "ดูรายละเอียด" : "View"}>
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" title={isTh ? "แก้ไข" : "Edit"}>
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" title={isTh ? "ลบ" : "Delete"}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <BookMarked className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">{isTh ? "ไม่พบรายวิชาที่ตรงกัน" : "No courses found"}</p>
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
