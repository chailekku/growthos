"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: number; label: string };
  className?: string;
  delay?: number;
}

export function StatCard({
  title, value, subtitle, icon: Icon,
  iconColor = "text-brand-600", iconBg = "bg-brand-50",
  trend, className, delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className={cn("hover:shadow-md transition-shadow duration-300", className)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
              {trend && (
                <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.value >= 0 ? "text-green-600" : "text-red-500"}`}>
                  <span>{trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%</span>
                  <span className="text-gray-400">{trend.label}</span>
                </div>
              )}
            </div>
            <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center shrink-0", iconBg)}>
              <Icon className={cn("h-5 w-5", iconColor)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
