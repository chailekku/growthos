"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, Plus, UserCheck, UserX, Edit, Trash2,
  Download, GraduationCap, Heart, Shield, User,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18nStore } from "@/store/i18n-store";
import { DEMO_ALL_USERS } from "@/lib/mock-data";
import type { UserRole } from "@/types";

type FilterRole   = "all" | UserRole;
type FilterStatus = "all" | "active" | "inactive";

const ROLE_CONFIG: Record<string, { label: string; labelEn: string; icon: React.ElementType; color: string; bg: string }> = {
  student:      { label: "นักศึกษา",    labelEn: "Student",       icon: User,          color: "text-blue-700",   bg: "bg-blue-50" },
  teacher:      { label: "อาจารย์",     labelEn: "Teacher",       icon: GraduationCap, color: "text-teal-700",   bg: "bg-teal-50" },
  psychologist: { label: "นักจิตวิทยา", labelEn: "Psychologist",  icon: Heart,         color: "text-purple-700", bg: "bg-purple-50" },
  super_admin:  { label: "Super Admin",  labelEn: "Super Admin",   icon: Shield,        color: "text-red-700",    bg: "bg-red-50" },
};

export default function AdminUsersPage() {
  const { language } = useI18nStore();
  const isTh = language === "th";

  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState<FilterRole>("all");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const counts = useMemo(() => ({
    total:        DEMO_ALL_USERS.length,
    students:     DEMO_ALL_USERS.filter(u => u.role === "student").length,
    teachers:     DEMO_ALL_USERS.filter(u => u.role === "teacher").length,
    psychologist: DEMO_ALL_USERS.filter(u => u.role === "psychologist").length,
    super_admin:  DEMO_ALL_USERS.filter(u => u.role === "super_admin").length,
    active:       DEMO_ALL_USERS.filter(u => u.isActive).length,
    inactive:     DEMO_ALL_USERS.filter(u => !u.isActive).length,
  }), []);

  const filtered = useMemo(() =>
    DEMO_ALL_USERS.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.includes(q) || u.department.includes(q);
      const matchRole   = roleFilter === "all"   || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || (statusFilter === "active" ? u.isActive : !u.isActive);
      return matchSearch && matchRole && matchStatus;
    }), [search, roleFilter, statusFilter]);

  const ROLE_FILTERS: { key: FilterRole; label: string; count: number }[] = [
    { key: "all",          label: isTh ? "ทั้งหมด"    : "All",           count: counts.total },
    { key: "student",      label: isTh ? "นักศึกษา"   : "Students",      count: counts.students },
    { key: "teacher",      label: isTh ? "อาจารย์"    : "Teachers",      count: counts.teachers },
    { key: "psychologist", label: isTh ? "นักจิตวิทยา" : "Psychologists", count: counts.psychologist },
    { key: "super_admin",  label: "Super Admin",                          count: counts.super_admin },
  ];

  return (
    <AppLayout title={isTh ? "จัดการผู้ใช้งาน" : "User Management"}>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{isTh ? "จัดการผู้ใช้งาน" : "User Management"}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isTh
                ? `ผู้ใช้ทั้งหมด ${counts.total} คน — ใช้งาน ${counts.active}, ไม่ใช้งาน ${counts.inactive}`
                : `${counts.total} total users — ${counts.active} active, ${counts.inactive} inactive`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              {isTh ? "ส่งออก" : "Export"}
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              {isTh ? "เพิ่มผู้ใช้" : "Add User"}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: isTh ? "นักศึกษา"    : "Students",      count: counts.students,     role: "student"      },
            { label: isTh ? "อาจารย์"     : "Teachers",      count: counts.teachers,     role: "teacher"      },
            { label: isTh ? "นักจิตวิทยา" : "Psychologists", count: counts.psychologist, role: "psychologist" },
            { label: "Super Admin",                           count: counts.super_admin,  role: "super_admin"  },
          ].map((c, i) => {
            const cfg  = ROLE_CONFIG[c.role];
            const Icon = cfg.icon;
            return (
              <motion.div key={i} whileHover={{ scale: 1.02 }} onClick={() => setRoleFilter(c.role as FilterRole)} className="cursor-pointer">
                <Card className={`border-2 transition-all ${roleFilter === c.role ? "border-brand-400 shadow-md" : "border-transparent"}`}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`h-10 w-10 ${cfg.bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${cfg.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{c.count}</p>
                      <p className="text-xs text-gray-500">{c.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
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
                placeholder={isTh ? "ค้นหาชื่อ, อีเมล, ภาควิชา..." : "Search name, email, department..."}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {ROLE_FILTERS.map((rf) => (
                <button
                  key={rf.key}
                  onClick={() => setRoleFilter(rf.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    roleFilter === rf.key ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {rf.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${roleFilter === rf.key ? "bg-white/20 text-white" : "bg-white text-gray-500"}`}>
                    {rf.count}
                  </span>
                </button>
              ))}
              <div className="ml-auto flex gap-2">
                {(["all", "active", "inactive"] as FilterStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                      statusFilter === s
                        ? s === "active" ? "bg-green-100 text-green-700" : s === "inactive" ? "bg-gray-200 text-gray-600" : "bg-brand-50 text-brand-700"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {s === "all" ? (isTh ? "ทั้งหมด" : "All") : s === "active" ? (isTh ? "ใช้งาน" : "Active") : (isTh ? "ไม่ใช้งาน" : "Inactive")}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {isTh ? `แสดง ${filtered.length} รายการ` : `Showing ${filtered.length} results`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {[
                      isTh ? "ชื่อ" : "Name",
                      isTh ? "บทบาท" : "Role",
                      isTh ? "คณะ / ภาค" : "Faculty / Dept.",
                      isTh ? "เข้าระบบล่าสุด" : "Last Login",
                      isTh ? "สถานะ" : "Status",
                      isTh ? "จัดการ" : "Actions",
                    ].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 first:px-6">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((u, i) => {
                      const cfg  = ROLE_CONFIG[u.role];
                      const Icon = cfg.icon;
                      return (
                        <motion.tr
                          key={u.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700 shrink-0">
                                {u.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                                <p className="text-xs text-gray-400 truncate">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                              <Icon className="h-3 w-3" />
                              {isTh ? cfg.label : cfg.labelEn}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-700">{u.faculty}</p>
                            <p className="text-xs text-gray-400">{u.department}</p>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{u.lastLogin}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                              {u.isActive ? (isTh ? "ใช้งาน" : "Active") : (isTh ? "ไม่ใช้งาน" : "Inactive")}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg" title={isTh ? "แก้ไข" : "Edit"}>
                                <Edit className="h-3.5 w-3.5 text-gray-500" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg" title={u.isActive ? (isTh ? "ปิดใช้งาน" : "Deactivate") : (isTh ? "เปิดใช้งาน" : "Activate")}>
                                {u.isActive ? <UserX className="h-3.5 w-3.5 text-orange-500" /> : <UserCheck className="h-3.5 w-3.5 text-green-500" />}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg" title={isTh ? "ลบ" : "Delete"}>
                                <Trash2 className="h-3.5 w-3.5 text-red-400" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{isTh ? "ไม่พบผู้ใช้งานที่ตรงกัน" : "No users found"}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
