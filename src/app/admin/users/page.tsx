"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, UserCheck, UserX, MoreVertical, Filter } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import type { UserRole } from "@/types";

const MOCK_USERS = [
  { id: "1", name: "พิมพ์ใจ รักเรียน", email: "pimjai@gekku.ac.th", role: "student" as UserRole, department: "วิทยาการคอมพิวเตอร์", lastLogin: "วันนี้", isActive: true },
  { id: "2", name: "ผศ.ดร. วรรณภา สอนดี", email: "wannapa@gekku.ac.th", role: "teacher" as UserRole, department: "วิทยาการคอมพิวเตอร์", lastLogin: "วันนี้", isActive: true },
  { id: "3", name: "นักจิตวิทยา สุขสันต์", email: "psych@gekku.ac.th", role: "psychologist" as UserRole, department: "ศูนย์สุขภาวะ", lastLogin: "เมื่อวาน", isActive: true },
  { id: "4", name: "ธนภัทร ใจดี", email: "thanapat@gekku.ac.th", role: "student" as UserRole, department: "บัญชี", lastLogin: "3 วันที่แล้ว", isActive: true },
  { id: "5", name: "ชนิกา สว่างใจ", email: "chanika@gekku.ac.th", role: "student" as UserRole, department: "การตลาด", lastLogin: "วันนี้", isActive: true },
  { id: "6", name: "Admin System", email: "sysadmin@gekku.ac.th", role: "system_admin" as UserRole, department: "IT", lastLogin: "วันนี้", isActive: false },
];

const ROLE_COLORS: Record<UserRole, string> = {
  student: "bg-brand-100 text-brand-700",
  teacher: "bg-calm-100 text-calm-700",
  psychologist: "bg-purple-100 text-purple-700",
  super_admin: "bg-red-100 text-red-700",
  system_admin: "bg-gray-100 text-gray-700",
};

const ROLE_LABELS_TH: Record<UserRole, string> = {
  student: "นักศึกษา",
  teacher: "อาจารย์",
  psychologist: "นักจิตวิทยา",
  super_admin: "ผู้ดูแล",
  system_admin: "IT Admin",
};

export default function AdminUsersPage() {
  const { language } = useI18nStore();
  const t = translations[language];
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [users, setUsers] = useState(MOCK_USERS);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleUser = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  return (
    <AppLayout title={t.admin.users.title}>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {([["all", "ทั้งหมด", MOCK_USERS.length], ["student", "นักศึกษา", MOCK_USERS.filter(u => u.role === "student").length], ["teacher", "อาจารย์", MOCK_USERS.filter(u => u.role === "teacher").length], ["psychologist", "นักจิตวิทยา", MOCK_USERS.filter(u => u.role === "psychologist").length], ["super_admin", "Admin", MOCK_USERS.filter(u => u.role === "super_admin" || u.role === "system_admin").length]] as const).map(([key, label, count]) => (
            <button
              key={key}
              onClick={() => setRoleFilter(key as UserRole | "all")}
              className={`p-3 rounded-xl text-left transition-all ${roleFilter === key ? "bg-brand-600 text-white shadow-sm" : "bg-white shadow-card hover:bg-gray-50"}`}
            >
              <p className={`text-xl font-bold ${roleFilter === key ? "text-white" : "text-gray-900"}`}>{count}</p>
              <p className={`text-xs ${roleFilter === key ? "text-white/70" : "text-gray-500"}`}>{label}</p>
            </button>
          ))}
        </div>

        {/* Search & Add */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder={language === "th" ? "ค้นหาผู้ใช้..." : "Search users..."} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Button className="gap-2 shrink-0">
            <Plus className="h-4 w-4" /> {t.admin.users.addUser}
          </Button>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">{language === "th" ? "ผู้ใช้" : "User"}</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">{t.admin.users.role}</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">{language === "th" ? "ภาควิชา" : "Department"}</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">{t.admin.users.lastLogin}</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">{t.admin.users.status}</th>
                    <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase">{t.admin.users.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar fallback={user.name} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ROLE_COLORS[user.role]}`}>
                          {ROLE_LABELS_TH[user.role]}
                        </span>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="text-sm text-gray-600">{user.department}</p>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <p className="text-sm text-gray-500">{user.lastLogin}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${user.isActive ? "bg-green-400" : "bg-gray-300"}`} />
                          <span className="text-xs text-gray-600">
                            {user.isActive ? t.admin.users.active : t.admin.users.inactive}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`text-xs h-7 ${user.isActive ? "text-red-500 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}
                            onClick={() => toggleUser(user.id)}
                          >
                            {user.isActive ? (
                              <><UserX className="h-3 w-3 mr-1" /> {t.admin.users.deactivate}</>
                            ) : (
                              <><UserCheck className="h-3 w-3 mr-1" /> {t.admin.users.activate}</>
                            )}
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
