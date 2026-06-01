"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, CheckSquare, Timer, BookOpen, TrendingUp,
  MessageSquare, Users, BarChart2, Heart, UserCog, FileText,
  Server, GraduationCap, Building2, LogOut, Sparkles,
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
}

function getNavItems(role: UserRole, t: typeof translations["en"]): NavItem[] {
  switch (role) {
    case "student":
      return [
        { label: t.nav.dashboard, href: "/student/dashboard", icon: LayoutDashboard },
        { label: t.nav.tasks, href: "/student/tasks", icon: CheckSquare },
        { label: t.nav.focus, href: "/student/focus", icon: Timer },
        { label: t.nav.reflection, href: "/student/reflection", icon: BookOpen },
        { label: t.nav.growth, href: "/student/growth", icon: TrendingUp },
        { label: t.nav.aiCoach, href: "/student/ai-coach", icon: Sparkles },
      ];
    case "teacher":
      return [
        { label: t.nav.dashboard, href: "/teacher/dashboard", icon: LayoutDashboard },
        { label: t.nav.students, href: "/teacher/students", icon: Users },
        { label: t.nav.analytics, href: "/teacher/analytics", icon: BarChart2 },
        { label: t.nav.courses, href: "/teacher/courses", icon: GraduationCap },
      ];
    case "psychologist":
      return [
        { label: t.nav.dashboard, href: "/psychologist/dashboard", icon: LayoutDashboard },
        { label: t.nav.wellbeing, href: "/psychologist/wellbeing", icon: Heart },
        { label: t.nav.analytics, href: "/psychologist/analytics", icon: BarChart2 },
      ];
    case "super_admin":
    case "system_admin":
      return [
        { label: t.nav.dashboard, href: "/admin/dashboard", icon: LayoutDashboard },
        { label: t.nav.users, href: "/admin/users", icon: UserCog },
        { label: t.nav.analytics, href: "/admin/analytics", icon: BarChart2 },
        { label: t.nav.departments, href: "/admin/departments", icon: Building2 },
        { label: t.nav.reports, href: "/admin/reports", icon: FileText },
        { label: t.nav.systemHealth, href: "/admin/system", icon: Server },
      ];
    default:
      return [];
  }
}

const roleColors: Record<UserRole, string> = {
  student: "from-brand-500 to-brand-600",
  teacher: "from-calm-500 to-calm-600",
  psychologist: "from-purple-500 to-purple-600",
  super_admin: "from-red-500 to-red-600",
  system_admin: "from-gray-600 to-gray-700",
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { language } = useI18nStore();
  const t = translations[language];

  if (!user) return null;

  const navItems = getNavItems(user.role, t);
  const gradientClass = roleColors[user.role];

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-gray-100 shadow-sm">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-6 py-5 bg-gradient-to-r ${gradientClass}`}>
        <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">Gekku</p>
          <p className="text-white/80 text-xs">GrowthOS</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
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
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            src={user.avatarUrl}
            alt={user.displayName}
            fallback={user.displayName}
            size="sm"
          />
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
