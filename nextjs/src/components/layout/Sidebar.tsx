"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, CheckSquare, Timer, BookOpen, TrendingUp,
  MessageSquare, Users, BarChart2, Heart, UserCog, FileText,
  Server, GraduationCap, Building2, LogOut, Sparkles, Shield,
  BookMarked, Settings,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  group?: string;
  items: NavItem[];
}

function getNavGroups(role: UserRole, t: typeof translations["en"]): NavGroup[] {
  switch (role) {
    case "student":
      return [
        {
          items: [
            { label: t.nav.dashboard,   href: "/student/dashboard",  icon: LayoutDashboard },
            { label: t.nav.tasks,       href: "/student/tasks",      icon: CheckSquare },
            { label: t.nav.focus,       href: "/student/focus",      icon: Timer },
            { label: t.nav.reflection,  href: "/student/reflection", icon: BookOpen },
            { label: t.nav.growth,      href: "/student/growth",     icon: TrendingUp },
            { label: t.nav.aiCoach,     href: "/student/ai-coach",   icon: Sparkles },
          ],
        },
      ];

    case "teacher":
      return [
        {
          group: "ภาพรวม",
          items: [
            { label: t.nav.dashboard,  href: "/teacher/dashboard", icon: LayoutDashboard },
            { label: t.nav.students,   href: "/teacher/students",  icon: Users },
          ],
        },
        {
          group: "วิชาเรียน",
          items: [
            { label: t.nav.courses,    href: "/teacher/courses",   icon: GraduationCap },
            { label: t.nav.analytics,  href: "/teacher/analytics", icon: BarChart2 },
          ],
        },
      ];

    case "psychologist":
      return [
        {
          group: "สุขภาวะ",
          items: [
            { label: t.nav.dashboard,  href: "/psychologist/dashboard", icon: LayoutDashboard },
            { label: t.nav.wellbeing,  href: "/psychologist/wellbeing", icon: Heart },
            { label: t.nav.analytics,  href: "/psychologist/analytics", icon: BarChart2 },
          ],
        },
      ];

    case "super_admin":
      return [
        {
          group: "ภาพรวม",
          items: [
            { label: t.nav.dashboard,    href: "/admin/dashboard",  icon: LayoutDashboard },
            { label: t.nav.analytics,    href: "/admin/analytics",  icon: BarChart2 },
            { label: t.nav.reports,      href: "/admin/reports",    icon: FileText },
          ],
        },
        {
          group: "จัดการผู้ใช้",
          items: [
            { label: t.nav.users,        href: "/admin/users",       icon: UserCog },
            { label: "อาจารย์",          href: "/admin/teachers",    icon: GraduationCap },
          ],
        },
        {
          group: "วิชาเรียน",
          items: [
            { label: "รายวิชา",          href: "/admin/courses",     icon: BookMarked },
            { label: "กลุ่มเรียน",       href: "/admin/sections",    icon: Building2 },
          ],
        },
        {
          group: "ระบบ",
          items: [
            { label: t.nav.systemHealth, href: "/admin/system",      icon: Server },
          ],
        },
      ];

    default:
      return [];
  }
}

const roleColors: Record<UserRole, string> = {
  student:      "from-brand-500 to-brand-600",
  teacher:      "from-calm-500 to-calm-600",
  psychologist: "from-purple-500 to-purple-600",
  super_admin:  "from-red-500 to-red-600",
};

const roleLabels: Record<UserRole, string> = {
  student:      "นักศึกษา",
  teacher:      "อาจารย์",
  psychologist: "นักจิตวิทยา",
  super_admin:  "Super Admin",
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { language } = useI18nStore();
  const t = translations[language];

  if (!user) return null;

  const navGroups = getNavGroups(user.role, t);
  const gradientClass = roleColors[user.role];

  return (
    <aside className="hidden md:flex flex-col fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-100 shadow-sm z-30 overflow-y-auto">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-6 py-5 bg-gradient-to-r ${gradientClass}`}>
        <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">KKU</p>
          <p className="text-white/80 text-xs">GrowthOS</p>
        </div>
        <div className="ml-auto">
          <span className="text-white/60 text-[10px] bg-white/10 rounded-full px-2 py-0.5">
            {roleLabels[user.role]}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.group && (
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
                {group.group}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-brand-50 text-brand-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-brand-600" : "text-gray-400")} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-[10px] bg-red-100 text-red-600 rounded-full px-1.5 py-0.5 font-semibold">
                          {item.badge}
                        </span>
                      )}
                      {isActive && !item.badge && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar src={user.avatarUrl} alt={user.displayName} fallback={user.displayName} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          {t.common.logout}
        </button>
      </div>
    </aside>
  );
}
