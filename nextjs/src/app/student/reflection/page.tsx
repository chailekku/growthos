"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, Lock, Eye, Plus, ChevronRight, Heart } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { DEMO_REFLECTIONS } from "@/lib/mock-data";
import { getMoodEmoji, formatDate } from "@/lib/utils";

const AI_PROMPTS = [
  { id: "grateful", emoji: "🙏" },
  { id: "learned", emoji: "💡" },
  { id: "improve", emoji: "🌱" },
  { id: "highlight", emoji: "⭐" },
  { id: "challenge", emoji: "💪" },
  { id: "mood", emoji: "💭" },
];

export default function ReflectionPage() {
  const { language } = useI18nStore();
  const t = translations[language];
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [gratitude, setGratitude] = useState(["", "", ""]);
  const [isPrivate, setIsPrivate] = useState(true);
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState<"write" | "history">("write");

  const prompts = t.student.reflection.prompts;
  const promptKeys = Object.keys(prompts) as Array<keyof typeof prompts>;

  const handleSave = () => {
    if (!content.trim()) return;
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setContent("");
      setActivePrompt(null);
    }, 2000);
  };

  const updateGratitude = (index: number, value: string) => {
    setGratitude((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <AppLayout title={t.student.reflection.title}>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Tab switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setView("write")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              view === "write" ? "bg-brand-600 text-white" : "bg-white text-gray-600 shadow-card"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            {t.student.reflection.daily}
          </button>
          <button
            onClick={() => setView("history")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              view === "history" ? "bg-brand-600 text-white" : "bg-white text-gray-600 shadow-card"
            }`}
          >
            <Eye className="h-4 w-4" />
            {t.student.reflection.pastEntries}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {view === "write" ? (
            <motion.div
              key="write"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
            >
              {/* AI Prompts */}
              <Card className="bg-gradient-to-br from-brand-50 to-purple-50 border-brand-100">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-brand-600" />
                    <p className="text-sm font-semibold text-brand-700">{t.student.reflection.aiPrompt}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{t.student.reflection.promptIntro}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {promptKeys.map((key, i) => (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setActivePrompt(key);
                          setContent(`${prompts[key]}\n\n`);
                        }}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-left transition-all ${
                          activePrompt === key
                            ? "bg-brand-100 text-brand-700 ring-1 ring-brand-300"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span>{AI_PROMPTS[i].emoji}</span>
                        <span className="font-medium">{prompts[key]}</span>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Write area */}
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "th" ? "บันทึกของฉัน" : "My Reflection"}
                    </label>
                    <Textarea
                      placeholder={t.student.reflection.promptIntro}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="h-40 text-sm"
                    />
                  </div>

                  {/* Gratitude */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🙏 {prompts.grateful}
                    </label>
                    <div className="space-y-2">
                      {gratitude.map((item, i) => (
                        <input
                          key={i}
                          type="text"
                          value={item}
                          onChange={(e) => updateGratitude(i, e.target.value)}
                          placeholder={`${i + 1}. ${language === "th" ? "ฉันรู้สึกขอบคุณ..." : "I'm grateful for..."}`}
                          className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Privacy */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {isPrivate ? <Lock className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {isPrivate ? t.student.reflection.privateNote : t.student.reflection.shareWithAdvisor}
                    </div>
                    <button
                      onClick={() => setIsPrivate((v) => !v)}
                      className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${isPrivate ? "bg-gray-300" : "bg-brand-500"}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${isPrivate ? "left-0.5" : "left-4"}`} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {saved ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-green-50 text-green-700 py-3 rounded-xl text-center text-sm font-medium"
                      >
                        ✓ {language === "th" ? "บันทึกการสะท้อนคิดแล้ว!" : "Reflection saved!"}
                      </motion.div>
                    ) : (
                      <Button onClick={handleSave} disabled={!content.trim()} className="w-full">
                        <Heart className="h-4 w-4 mr-2" />
                        {t.student.reflection.submit}
                      </Button>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {DEMO_REFLECTIONS.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>{t.student.reflection.noEntries}</p>
                  <Button variant="soft" className="mt-4" onClick={() => setView("write")}>
                    <Plus className="h-4 w-4 mr-1" /> {t.student.reflection.newEntry}
                  </Button>
                </div>
              ) : (
                DEMO_REFLECTIONS.map((entry) => (
                  <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant={entry.type === "daily" ? "default" : "info"} className="text-xs">
                              {entry.type === "daily" ? t.student.reflection.daily : t.student.reflection.weekly}
                            </Badge>
                            {entry.mood && (
                              <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            {entry.isPrivate && <Lock className="h-3 w-3" />}
                            {formatDate(entry.createdAt, language === "th" ? "th-TH" : "en-US")}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{entry.content}</p>
                        {entry.aiInsight && (
                          <div className="mt-3 p-3 rounded-xl bg-brand-50 border border-brand-100">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Sparkles className="h-3 w-3 text-brand-600" />
                              <span className="text-xs font-semibold text-brand-700">AI Insight</span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">{entry.aiInsight}</p>
                          </div>
                        )}
                        {entry.gratitude && entry.gratitude.length > 0 && (
                          <div className="mt-3 flex gap-1 flex-wrap">
                            {entry.gratitude.map((g, i) => (
                              <span key={i} className="text-xs bg-warmth-50 text-warmth-700 px-2 py-1 rounded-lg">🙏 {g}</span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
