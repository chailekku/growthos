"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap, Search, Plus, BookMarked, Users, Edit,
  UserX, UserCheck, Trash2, Download,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useI18nStore } from "@/store/i18n-store";
import { DEMO_TEACHERS_LIST } from "@/lib/mock-data";

export default function AdminTeachersPage() {
  const { language } = useI18nStore();
  const isTh = language === "th";

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const filtered = useMemo(() =>
    DEMO_TEACHERS_LIST.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch  = !q || t.name.includes(search) || t.email.includes(q) || t.department.includes(search);
      const matchStatus  = statusFilter === "all" || (statusFilter === "active" ? t.isActive : !t.isActive);
      return matchSearch && matchStatus;
    }), [search, statusFilter]);

  return (
    <AppLayout title={isTh ? "จัดการอาจารย์" : "Teacher Management"}>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{isTh ? "จัดการอาจารย์" : "Teacher Management"}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isTh ? `อาจารย์ทั้งหมด ${DEMO_TEACHERS_LIST.length} คน` : `${DEMO_TEACHERS_LIST.length} teachers total`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              {isTh ? "ส่งออก" : "Export"}
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              {isTh ? "เพิ่มอาจารย์" : "Add Teacher"}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isTh ? "ค้นหาชื่อ, อีเมล, ภาควิชา..." : "Search name, email, department..."}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "active", "inactive"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                    statusFilter === s
                      ? s === "active" ? "bg-green-100 text-green-700" : s === "inactive" ? "bg-gray-200 text-gray-600" : "bg-brand-600 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {s === "all" ? (isTh ? "ทั้งหมด" : "All") : s === "active" ? (isTh ? "ใช้งาน" : "Active") : (isTh ? "ไม่ใช้งาน" : "Inactive")}
                </button>
              ))}
              <span className="text-xs text-gray-400 self-center ml-2">
                {isTh ? `พบ ${filtered.length} คน` : `${filtered.length} found`}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {[
                      isTh ? "อาจารย์" : "Teacher",
                      isTh ? "ภาควิชา / คณะ" : "Dept. / Faculty",
                      isTh ? "วิชาที่สอน" : "Courses",
                      isTh ? "นักศึกษา" : "Students",
                      isTh ? "สถานะ" : "Status",
                      isTh ? "จัดการ" : "Actions",
                    ].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 first:px-6">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, i) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700 shrink-0">
                            {t.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{t.name}</p>
                            <p className="text-xs text-gray-400">{t.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{t.department}</p>
                        <p className="text-xs text-gray-400">{t.faculty}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <BookMarked className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-700">{t.courses} {isTh ? "วิชา" : "courses"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-700">{t.students} {isTh ? "คน" : "students"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {t.isActive ? (isTh ? "ใช้งาน" : "Active") : (isTh ? "ไม่ใช้งาน" : "Inactive")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
                            <Edit className="h-3.5 w-3.5 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
                            {t.isActive ? <UserX className="h-3.5 w-3.5 text-orange-500" /> : <UserCheck className="h-3.5 w-3.5 text-green-500" />}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <GraduationCap className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{isTh ? "ไม่พบอาจารย์ที่ตรงกัน" : "No teachers found"}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
