"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuthStore } from "@/store/auth-store";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  requireAuth?: boolean;
}

export function AppLayout({ children, title, requireAuth = true }: AppLayoutProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex flex-col min-h-screen md:pl-64">
        <Header title={title} />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
