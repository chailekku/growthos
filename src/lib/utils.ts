import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function formatDate(date: Date, locale = "th-TH"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatTime(date: Date, locale = "th-TH"): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getGreeting(language: "th" | "en" = "en"): string {
  const hour = new Date().getHours();
  if (language === "th") {
    if (hour < 12) return "สวัสดีตอนเช้า";
    if (hour < 17) return "สวัสดีตอนบ่าย";
    return "สวัสดีตอนเย็น";
  }
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getMoodEmoji(level: number): string {
  const emojis = ["", "😔", "😕", "😐", "😊", "😄"];
  return emojis[level] || "😐";
}

export function getMoodColor(level: number): string {
  const colors = ["", "bg-red-100 text-red-700", "bg-orange-100 text-orange-700", "bg-yellow-100 text-yellow-700", "bg-green-100 text-green-700", "bg-emerald-100 text-emerald-700"];
  return colors[level] || colors[3];
}

export function getRiskColor(risk: string): string {
  switch (risk) {
    case "low": return "text-green-600 bg-green-50";
    case "moderate": return "text-yellow-600 bg-yellow-50";
    case "elevated": return "text-orange-600 bg-orange-50";
    case "high": return "text-red-600 bg-red-50";
    default: return "text-gray-600 bg-gray-50";
  }
}

export function calcProductivityScore(tasksCompleted: number, focusMinutes: number, reflectedToday: boolean): number {
  const taskScore = Math.min(tasksCompleted * 10, 40);
  const focusScore = Math.min(Math.floor(focusMinutes / 3), 40);
  const reflectionBonus = reflectedToday ? 20 : 0;
  return Math.min(taskScore + focusScore + reflectionBonus, 100);
}

export function generateAvatarUrl(name: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6366f1`;
}

export function daysAgo(date: Date): number {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "…" : str;
}
