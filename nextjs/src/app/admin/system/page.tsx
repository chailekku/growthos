"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { Server, Shield, Sparkles, Bell, Database, Download, Activity } from "lucide-react";

export default function AdminSystemPage() {
  const { language } = useI18nStore();
  const t = translations[language];
  const [aiModel, setAiModel] = useState("gpt-4o-mini");
  const [maxTokens, setMaxTokens] = useState("500");
  const [notifications, setNotifications] = useState({ email: true, burnout: true, inactivity: true, weekly: true });

  const SYSTEM_STATUS = [
    { service: "API Server", status: "🟢 Operational", uptime: "99.97%", latency: "45ms" },
    { service: "Firebase Firestore", status: "🟢 Operational", uptime: "99.95%", latency: "120ms" },
    { service: "OpenAI API", status: "🟡 Degraded", uptime: "97.20%", latency: "890ms" },
    { service: "Authentication", status: "🟢 Operational", uptime: "100%", latency: "30ms" },
    { service: "Notification Service", status: "🟢 Operational", uptime: "99.80%", latency: "200ms" },
  ];

  return (
    <AppLayout title={t.admin.system.title}>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              {language === "th" ? "สถานะระบบแบบเรียลไทม์" : "Real-Time System Status"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["บริการ", "สถานะ", "Uptime", "Latency"].map((h) => (
                      <th key={h} className="text-left py-2 px-3 text-xs text-gray-500 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SYSTEM_STATUS.map((row, i) => (
                    <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-800">{row.service}</td>
                      <td className="py-3 px-3 text-sm">{row.status}</td>
                      <td className="py-3 px-3 text-green-600 font-medium">{row.uptime}</td>
                      <td className="py-3 px-3 text-gray-500">{row.latency}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Config */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                {t.admin.system.aiConfig}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{language === "th" ? "โมเดล AI" : "AI Model"}</label>
                <select value={aiModel} onChange={(e) => setAiModel(e.target.value)} className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option value="gpt-4o-mini">GPT-4o Mini (ประหยัด)</option>
                  <option value="gpt-4o">GPT-4o (แนะนำ)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{language === "th" ? "Max Tokens ต่อการตอบ" : "Max Tokens per Response"}</label>
                <Input value={maxTokens} onChange={(e) => setMaxTokens(e.target.value)} type="number" />
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                {language === "th" ? "⚠️ การเปลี่ยนแปลง AI Model จะมีผลกับผู้ใช้ทุกคน" : "⚠️ AI Model changes affect all users immediately"}
              </div>
              <Button className="w-full">{language === "th" ? "บันทึกการตั้งค่า AI" : "Save AI Config"}</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-brand-500" />
                {t.admin.system.notifications}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => {
                const labels: Record<string, { th: string; en: string }> = {
                  email: { th: "การแจ้งเตือนทางอีเมล", en: "Email Notifications" },
                  burnout: { th: "แจ้งเตือนความเสี่ยง Burnout", en: "Burnout Risk Alerts" },
                  inactivity: { th: "แจ้งเตือนการไม่ใช้งาน", en: "Inactivity Alerts" },
                  weekly: { th: "รายงานสัปดาห์", en: "Weekly Reports" },
                };
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{language === "th" ? labels[key].th : labels[key].en}</span>
                    <button
                      onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                      className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${value ? "bg-brand-500" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? "left-4" : "left-0.5"}`} />
                    </button>
                  </div>
                );
              })}
              <Button variant="outline" className="w-full">{language === "th" ? "บันทึกการแจ้งเตือน" : "Save Notifications"}</Button>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                {t.admin.system.security}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { label: language === "th" ? "Two-Factor Auth (2FA)" : "Two-Factor Auth", value: language === "th" ? "เปิดใช้งาน" : "Enabled", color: "text-green-600" },
                { label: language === "th" ? "Session Timeout" : "Session Timeout", value: "8 hours", color: "text-gray-600" },
                { label: language === "th" ? "การเข้ารหัสข้อมูล" : "Data Encryption", value: "AES-256", color: "text-green-600" },
                { label: "Firebase Rules", value: language === "th" ? "อัปเดตล่าสุด" : "Up to date", color: "text-green-600" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-600">{item.label}</span>
                  <span className={`font-medium ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Backup & Export */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-500" />
                {t.admin.system.backup}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
                ✓ {language === "th" ? "สำรองข้อมูลล่าสุด: วันนี้ 03:00 น." : "Last backup: Today 03:00 AM"}
              </div>
              <Button variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                {language === "th" ? "ส่งออกข้อมูลทั้งหมด (CSV)" : "Export All Data (CSV)"}
              </Button>
              <Button variant="outline" className="w-full gap-2 text-orange-600 border-orange-200 hover:bg-orange-50">
                <Database className="h-4 w-4" />
                {language === "th" ? "สำรองข้อมูลทันที" : "Trigger Manual Backup"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
