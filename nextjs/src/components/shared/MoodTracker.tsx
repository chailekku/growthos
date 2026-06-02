"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";

const MOOD_EMOJIS = ["", "😔", "😕", "😐", "😊", "😄"];
const ENERGY_ICONS = ["", "🔋", "🔋", "⚡", "⚡", "🚀"];

interface MoodTrackerProps {
  onSave?: (mood: number, energy: number, emotions: string[], notes: string) => void;
  compact?: boolean;
}

export function MoodTracker({ onSave, compact = false }: MoodTrackerProps) {
  const { language } = useI18nStore();
  const t = translations[language];
  const [mood, setMood] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const emotionList = t.student.mood.emotionList;

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
    );
  };

  const handleSave = () => {
    if (mood === 0) return;
    onSave?.(mood, energy, selectedEmotions, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t.student.mood.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-3">{t.student.mood.howFeeling}</p>
          <div className="flex gap-2 justify-between">
            {[1, 2, 3, 4, 5].map((level) => (
              <motion.button
                key={level}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMood(level)}
                className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  mood === level ? "bg-brand-50 ring-2 ring-brand-500" : "hover:bg-gray-50"
                }`}
              >
                <span className="text-2xl">{MOOD_EMOJIS[level]}</span>
                {!compact && (
                  <span className="text-xs text-gray-500">
                    {t.student.mood.levels[level as 1 | 2 | 3 | 4 | 5]}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {!compact && (
          <>
            <div>
              <p className="text-sm text-gray-600 mb-2">{t.student.mood.energy}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setEnergy(level)}
                    className={`flex-1 py-2 rounded-xl text-sm transition-all ${
                      energy === level ? "bg-calm-50 ring-2 ring-calm-500" : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {ENERGY_ICONS[level]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">{t.student.mood.emotions}</p>
              <div className="flex flex-wrap gap-2">
                {emotionList.map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => toggleEmotion(emotion)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedEmotions.includes(emotion)
                        ? "bg-brand-100 text-brand-700 ring-1 ring-brand-300"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder={t.student.mood.notes}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-20 text-sm"
            />
          </>
        )}

        <AnimatePresence>
          {saved ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-green-50 text-green-700 text-sm py-2 px-4 rounded-xl text-center font-medium"
            >
              ✓ บันทึกแล้ว!
            </motion.div>
          ) : (
            <Button onClick={handleSave} disabled={mood === 0} className="w-full">
              {t.student.mood.save}
            </Button>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
