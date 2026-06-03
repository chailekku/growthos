"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useI18nStore } from "@/store/i18n-store";
import { useAuthStore } from "@/store/auth-store";
import { translations } from "@/i18n";
import type { AICoachType } from "@/types";
import { Avatar } from "@/components/ui/avatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  coachType?: AICoachType;
}

const COACH_TYPES: {
  type: AICoachType;
  emoji: string;
  labelTh: string;
  labelEn: string;
  color: string;
}[] = [
  { type: "productivity", emoji: "⚡", labelTh: "ผลิตภาพ",    labelEn: "Productivity", color: "bg-blue-100 text-blue-700" },
  { type: "reflection",   emoji: "💭", labelTh: "สะท้อนคิด",  labelEn: "Reflection",   color: "bg-purple-100 text-purple-700" },
  { type: "focus",        emoji: "🎯", labelTh: "โฟกัส",       labelEn: "Focus",        color: "bg-brand-100 text-brand-700" },
  { type: "wellbeing",    emoji: "💚", labelTh: "สุขภาวะ",     labelEn: "Wellbeing",    color: "bg-green-100 text-green-700" },
  { type: "self_leadership", emoji: "🌟", labelTh: "ผู้นำตนเอง", labelEn: "Leadership", color: "bg-warmth-100 text-warmth-700" },
];

const SUGGESTED_PROMPTS = {
  th: [
    "ฉันรู้สึกท่วมท้นกับงานที่มีเยอะมาก ช่วยแนะนำได้ไหม?",
    "ฉันจะจัดการสมาธิให้ดีขึ้นได้อย่างไร?",
    "ช่วยตั้งคำถามสะท้อนคิดสำหรับวันนี้ให้หน่อยได้ไหม?",
    "ฉันรู้สึกเหนื่อยและหมดแรงบันดาลใจ จะทำอย่างไรดี?",
  ],
  en: [
    "I'm feeling overwhelmed with too many tasks. Can you help?",
    "How can I improve my focus and concentration?",
    "Can you give me a reflection prompt for today?",
    "I'm feeling tired and unmotivated. What should I do?",
  ],
};

/** Detect language from message content using Thai Unicode block */
function detectLang(text: string): "th" | "en" {
  return /[฀-๿]/.test(text) ? "th" : "en";
}

/** Initial greeting message in the correct UI language */
function getInitialMessage(lang: string): Message {
  const content =
    lang === "th"
      ? "ยินดีที่ได้คุยด้วยนะ 🌱\n\nที่นี่คือพื้นที่ปลอดภัย ไม่มีการตัดสิน ไม่มีการกดดัน แค่การคุยกันอย่างตรงไปตรงมา\n\nบอกได้เลยว่าวันนี้มีอะไรอยู่ในหัว — ไม่ว่าจะเป็นเรื่องการเรียน งาน อารมณ์ หรือแค่อยากระบาย ฉันอยู่ที่นี่เสมอ 💚"
      : "Hey, glad you're here 🌱\n\nThis is a safe space — no judgment, no pressure. Just honest conversation.\n\nWhat's on your mind today? Whether it's studies, tasks, emotions, or just needing to think out loud — I'm here 💚";

  return { id: "0", role: "assistant", content, timestamp: new Date() };
}

/** Local fallback demo response (used when API is unreachable) */
function getLocalDemoResponse(content: string, coachType: AICoachType): string {
  const lower = content.toLowerCase();
  const lang = detectLang(content);

  if (lang === "en") {
    if (lower.includes("tired") || lower.includes("exhausted") || lower.includes("unmotivated")) {
      return "Thank you for sharing that with me 💚\n\nFeeling tired is an important signal from your body and mind. Sometimes the most productive thing you can do is genuinely rest.\n\nAsk yourself: Am I sleeping enough? Am I doing things I enjoy?\n\nIf this feeling persists, please consider talking to your university counselor. You're not alone 💜";
    }
    if (lower.includes("focus") || lower.includes("concentrate") || lower.includes("distract")) {
      return "Focus is a skill — it's trainable, not a fixed trait 🎯\n\nTry these now:\n• Pomodoro: 25 min work, 5 min break\n• Turn off ALL notifications\n• Tell yourself 'just 5 minutes' — momentum does the rest\n\nYour focus is usually sharpest in the morning. Observe your rhythm ✨";
    }
    if (lower.includes("overwhelm") || lower.includes("stress") || lower.includes("anxious") || lower.includes("worried")) {
      return "What you're feeling is completely valid 🌱\n\nTry these small steps:\n• 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s\n• Write your worries down, then ask: 'Can I actually control this?'\n\nIf things feel really heavy, a university counselor is there to help 💚";
    }
    switch (coachType) {
      case "productivity":
        return "Thanks for sharing 😊\n\nTry starting your day by picking just 3 most important tasks and finishing one before moving to the next.\n\nRemember: being 'busy' doesn't always mean being productive ✨";
      case "reflection":
        return "Reflection is a gift you give yourself 📝\n\nAsk: What did I learn today? Were there moments that felt especially good or challenging?\n\n3–5 sentences done consistently makes a real difference 🌱";
      case "wellbeing":
        return "Good wellbeing is the foundation of everything 💚\n\nCheck these 4 pillars: enough sleep? some movement? personal time? meaningful connection?\n\nPick one to improve this week 🌸";
      default:
        return "Thank you for trusting GrowthOS AI Coach 🌱\n\nI'm here to help you grow sustainably and happily — not just to be productive.\n\nWhat would you like help with today? ✨";
    }
  }

  /* Thai fallback */
  if (lower.includes("เหนื่อย") || lower.includes("หมดแรง") || lower.includes("หมดแรงบันดาลใจ")) {
    return "ขอบคุณที่ไว้วางใจเล่าให้ฟัง 🙏\n\nความเหนื่อยล้าเป็นสัญญาณสำคัญที่ร่างกายและจิตใจส่งมา บางครั้งการพักผ่อนจริงๆ คือสิ่งที่ productive ที่สุด\n\nลองถามตัวเองว่า: นอนหลับพอไหม? ได้ทำสิ่งที่ชอบบ้างไหม?\n\nถ้ารู้สึกแย่ต่อเนื่อง ลองพูดคุยกับนักจิตวิทยาของมหาวิทยาลัยนะ 💜";
  }
  if (lower.includes("ท่วมท้น") || lower.includes("เยอะมาก") || lower.includes("เครียด") || lower.includes("กังวล")) {
    return "ความรู้สึกท่วมท้นเป็นสัญญาณว่าคุณสนใจผลลัพธ์ที่ดี นั่นเป็นเรื่องดี! 🌟\n\nลองลิสต์งานทั้งหมดออกมาก่อน แล้วเลือกแค่ 3 อย่างที่สำคัญที่สุดสำหรับวันนี้\n\nจำไว้ว่า: การทำน้อยแต่ดีกว่า ดีกว่าทำทุกอย่างแบบครึ่งๆ กลางๆ นะ 🌱";
  }
  if (lower.includes("สมาธิ") || lower.includes("โฟกัส")) {
    return "เรื่องสมาธินี่น่าสนใจมาก! 🎯\n\nสิ่งที่ช่วยได้ทันที:\n1. ปิดการแจ้งเตือนทั้งหมด\n2. ทำงานเดียวต่อครั้ง (single-tasking)\n3. ลอง Pomodoro: โฟกัส 25 นาที พัก 5 นาที\n\nสมองชอบความชัดเจน ลองบอกตัวเองว่า 'ฉันจะทำ [งานนี้] จนกว่าจะเสร็จ' ก่อนเริ่ม";
  }
  switch (coachType) {
    case "productivity":
      return "ขอบคุณที่แชร์เรื่องนี้ 😊\n\nสำหรับผลิตภาพที่ดี ลองเริ่มต้นวันด้วยการเลือก 3 งานสำคัญที่สุด แล้วทำทีละชิ้นจนเสร็จก่อนไปชิ้นถัดไป\n\nจำไว้ว่า 'ยุ่ง' ไม่ได้แปลว่า 'productive' นะ ✨";
    case "reflection":
      return "การสะท้อนคิดเป็นของขวัญที่คุณมอบให้ตัวเอง 📝\n\nลองถามตัวเองว่า: วันนี้ฉันได้เรียนรู้อะไร? มีช่วงไหนที่รู้สึกดีหรือท้าทายเป็นพิเศษ?\n\nไม่ต้องเขียนเยอะ แค่ 3-5 ประโยคก็พอ สิ่งสำคัญคือทำสม่ำเสมอ 🌱";
    case "wellbeing":
      return "สุขภาวะที่ดีเป็นรากฐานของทุกอย่าง 💚\n\nลองตรวจสอบ 4 เสาหลัก: นอนหลับพอ? ออกกำลังกายบ้าง? มีเวลาส่วนตัว? ได้พูดคุยกับคนที่คุณชอบไหม?\n\nถ้าขาดข้อไหน ลองเพิ่มสักข้อหนึ่งในสัปดาห์นี้ก็พอ 🌸";
    default:
      return "ขอบคุณที่ไว้วางใจ GrowthOS AI Coach 🌱\n\nฉันอยู่ที่นี่เพื่อช่วยให้คุณเติบโตในแบบที่ยั่งยืนและมีความสุข ไม่ใช่แค่ productive\n\nบอกฉันได้เลยว่าวันนี้คุณต้องการความช่วยเหลือด้านไหน? ✨";
  }
}

export default function AICoachPage() {
  const { language } = useI18nStore();
  const { user } = useAuthStore();
  const t = translations[language];

  const [messages, setMessages] = useState<Message[]>(() => [getInitialMessage(language)]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeCoach, setActiveCoach] = useState<AICoachType>("productivity");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* Scroll to bottom on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Reset welcome message when UI language changes (only if conversation not started) */
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "0") {
        return [getInitialMessage(language)];
      }
      return prev;
    });
  }, [language]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    let responseContent: string;

    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, coachType: activeCoach }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      responseContent = data.response;
    } catch {
      /* Network / API unavailable — use local bilingual demo response */
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
      responseContent = getLocalDemoResponse(content, activeCoach);
    }

    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        coachType: activeCoach,
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const suggestedPrompts = SUGGESTED_PROMPTS[language] ?? SUGGESTED_PROMPTS.en;

  return (
    <AppLayout title={t.student.aiCoach.title}>
      <div className="max-w-3xl mx-auto h-[calc(100vh-10rem)] flex flex-col gap-4">

        {/* Coach Type Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
          {COACH_TYPES.map(({ type, emoji, labelTh, labelEn, color }) => (
            <button
              key={type}
              onClick={() => setActiveCoach(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeCoach === type
                  ? color + " ring-2 ring-offset-1 ring-brand-300"
                  : "bg-white text-gray-500 shadow-card"
              }`}
            >
              <span>{emoji}</span>
              {language === "th" ? labelTh : labelEn}
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <Card className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className="shrink-0">
                  {msg.role === "assistant" ? (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <Avatar src={user?.avatarUrl} fallback={user?.displayName} size="sm" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user" ? "bg-brand-600 text-white" : "bg-gray-50 text-gray-800"
                  }`}
                >
                  {msg.content.split("\n").map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                  <p className={`text-xs mt-1 ${msg.role === "user" ? "text-white/60" : "text-gray-400"}`}>
                    {msg.timestamp.toLocaleTimeString(language === "th" ? "th-TH" : "en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-full bg-gray-400"
                      animate={{ y: ["0%", "-50%", "0%"] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts — shown only before the user sends their first message */}
          {messages.length <= 1 && (
            <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
              {suggestedPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(p)}
                  className="shrink-0 px-3 py-2 rounded-xl bg-brand-50 text-brand-700 text-xs hover:bg-brand-100 transition-colors max-w-[200px] text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 p-4 shrink-0">
            <p className="text-xs text-gray-400 mb-2 text-center">{t.student.aiCoach.disclaimer}</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.student.aiCoach.placeholder}
                className="flex-1 h-12 min-h-[48px] max-h-32 resize-none text-sm py-3"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isTyping}
                className="h-12 w-12 rounded-xl shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
