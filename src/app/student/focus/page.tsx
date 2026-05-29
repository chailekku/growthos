"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, RotateCcw, Zap, Brain, Coffee, Settings } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/shared/StatCard";
import { AIInsightCard } from "@/components/shared/AIInsightCard";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { DEMO_FOCUS_SESSIONS, DEMO_WEEKLY_FOCUS_DATA } from "@/lib/mock-data";
import { formatMinutes } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type TimerState = "idle" | "running" | "paused" | "break";
type SessionMode = "pomodoro" | "deep_work" | "short";

const SESSION_CONFIGS: Record<SessionMode, { focus: number; break: number; labelTh: string; labelEn: string; icon: React.ComponentType<{className?: string}> }> = {
  pomodoro: { focus: 25, break: 5, labelTh: "โปโมโดโร", labelEn: "Pomodoro", icon: Zap },
  deep_work: { focus: 60, break: 10, labelTh: "งานเชิงลึก", labelEn: "Deep Work", icon: Brain },
  short: { focus: 15, break: 3, labelTh: "โฟกัสสั้น", labelEn: "Quick Focus", icon: Coffee },
};

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function FocusPage() {
  const { language } = useI18nStore();
  const t = translations[language];

  const [mode, setMode] = useState<SessionMode>("pomodoro");
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [secondsLeft, setSecondsLeft] = useState(SESSION_CONFIGS.pomodoro.focus * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(2);
  const [totalFocusSeconds, setTotalFocusSeconds] = useState(95 * 60);
  const [distractions, setDistractions] = useState(0);

  const config = SESSION_CONFIGS[mode];
  const totalSeconds = (isBreak ? config.break : config.focus) * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const handleModeChange = (newMode: SessionMode) => {
    setMode(newMode);
    setTimerState("idle");
    setIsBreak(false);
    setSecondsLeft(SESSION_CONFIGS[newMode].focus * 60);
  };

  const handleStart = () => setTimerState("running");
  const handlePause = () => setTimerState("paused");
  const handleResume = () => setTimerState("running");
  const handleStop = () => {
    setTimerState("idle");
    setIsBreak(false);
    setSecondsLeft(config.focus * 60);
  };

  const handleDistraction = () => setDistractions((d) => d + 1);

  useEffect(() => {
    if (timerState !== "running") return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!isBreak) {
            setSessionsCompleted((s) => s + 1);
            setTotalFocusSeconds((t) => t + config.focus * 60);
            setIsBreak(true);
            setTimerState("break");
            return config.break * 60;
          } else {
            setIsBreak(false);
            setTimerState("idle");
            return config.focus * 60;
          }
        }
        if (!isBreak) setTotalFocusSeconds((t) => t + 1);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerState, isBreak, config]);

  const circleRadius = 100;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AppLayout title={t.student.focus.title}>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Mode Selector */}
        <div className="flex gap-3 justify-center">
          {(Object.entries(SESSION_CONFIGS) as [SessionMode, typeof SESSION_CONFIGS[SessionMode]][]).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const isActive = mode === key;
            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModeChange(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? "bg-brand-600 text-white shadow-md" : "bg-white text-gray-600 shadow-card hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {language === "th" ? cfg.labelTh : cfg.labelEn}
                <span className="text-xs opacity-70">{cfg.focus}m</span>
              </motion.button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8 flex flex-col items-center gap-6">
                {/* Phase label */}
                <motion.div
                  key={isBreak ? "break" : "focus"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    isBreak ? "bg-green-100 text-green-700" : "bg-brand-100 text-brand-700"
                  }`}
                >
                  {isBreak
                    ? (language === "th" ? "🌿 พักผ่อน" : "🌿 Break Time")
                    : (language === "th" ? "🎯 โฟกัส" : "🎯 Focus Time")
                  }
                </motion.div>

                {/* SVG Timer Circle */}
                <div className="relative">
                  <svg width="260" height="260" className="rotate-[-90deg]">
                    <circle cx="130" cy="130" r={circleRadius} strokeWidth="10" stroke="#f1f5f9" fill="none" />
                    <motion.circle
                      cx="130" cy="130" r={circleRadius}
                      strokeWidth="10"
                      stroke={isBreak ? "#14b8a6" : "#6366f1"}
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                    <motion.span
                      key={secondsLeft}
                      className="text-5xl font-bold text-gray-900 tabular-nums"
                    >
                      {formatSeconds(secondsLeft)}
                    </motion.span>
                    <span className="text-sm text-gray-400 mt-1">
                      {isBreak
                        ? (language === "th" ? "หยุดพักสักครู่" : "Take a breath")
                        : (language === "th" ? "สมาธิอยู่ที่นี่" : "Stay focused")
                      }
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={handleStop} disabled={timerState === "idle"} className="h-12 w-12 rounded-2xl">
                    <Square className="h-5 w-5" />
                  </Button>

                  <AnimatePresence mode="wait">
                    {timerState === "idle" || timerState === "paused" ? (
                      <motion.div key="play" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                        <Button onClick={timerState === "idle" ? handleStart : handleResume} size="icon" className="h-16 w-16 rounded-full shadow-glow">
                          <Play className="h-7 w-7" />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div key="pause" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                        <Button onClick={handlePause} size="icon" className="h-16 w-16 rounded-full bg-orange-500 hover:bg-orange-600 shadow-md">
                          <Pause className="h-7 w-7" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button variant="outline" size="icon" onClick={handleStop} className="h-12 w-12 rounded-2xl">
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>

                {/* Distraction counter */}
                {timerState === "running" && !isBreak && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
                    <button
                      onClick={handleDistraction}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 text-sm hover:bg-orange-100 transition-colors"
                    >
                      ⚡ {language === "th" ? "บันทึกความฟุ้ง" : "Mark distraction"}
                      {distractions > 0 && <span className="font-bold">({distractions})</span>}
                    </button>
                  </motion.div>
                )}

                {/* Session info */}
                <div className="w-full border-t border-gray-100 pt-4 grid grid-cols-3 text-center gap-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{sessionsCompleted}</p>
                    <p className="text-xs text-gray-500">{t.student.focus.sessionsToday}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{formatMinutes(Math.floor(totalFocusSeconds / 60))}</p>
                    <p className="text-xs text-gray-500">{t.student.focus.totalFocusTime}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{Math.max(0, 10 - distractions * 2) * 10}%</p>
                    <p className="text-xs text-gray-500">{t.student.focus.flowScore}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right panel */}
          <div className="space-y-5">
            <AIInsightCard
              insight=""
              title={language === "th" ? "เคล็ดลับการโฟกัส" : "Focus Tips"}
            />

            {/* Session History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.student.focus.focusHistory}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={DEMO_WEEKLY_FOCUS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={(v) => [`${v}m`, "โฟกัส"]} contentStyle={{ borderRadius: "12px", border: "none" }} />
                    <Bar dataKey="minutes" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-4 space-y-2">
                  {DEMO_FOCUS_SESSIONS.slice(0, 2).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {session.type === "pomodoro" ? "🍅 Pomodoro" : "🧠 Deep Work"}
                        </p>
                        <p className="text-xs text-gray-400">{formatMinutes(session.actualMinutes)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-brand-600">{session.flowScore}%</p>
                        <p className="text-xs text-gray-400">flow</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
