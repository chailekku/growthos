"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot, User, RefreshCw } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
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

const COACH_TYPES: { type: AICoachType; emojiTh: string; labelTh: string; labelEn: string; color: string }[] = [
  { type: "productivity", emojiTh: "⚡", labelTh: "ผลิตภาพ", labelEn: "Productivity", color: "bg-blue-100 text-blue-700" },
  { type: "reflection", emojiTh: "💭", labelTh: "สะท้อนคิด", labelEn: "Reflection", color: "bg-purple-100 text-purple-700" },
  { type: "focus", emojiTh: "🎯", labelTh: "โฟกัส", labelEn: "Focus", color: "bg-brand-100 text-brand-700" },
  { type: "wellbeing", emojiTh: "💚", labelTh: "สุขภาวะ", labelEn: "Wellbeing", color: "bg-green-100 text-green-700" },
  { type: "self_leadership", emojiTh: "🌟", labelTh: "ผู้นำตนเอง", labelEn: "Leadership", color: "bg-warmth-100 text-warmth-700" },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "0",
    role: "assistant",
    content: "สวัสดี! ฉันคือ GrowthOS AI Coach ของคุณ 🌱\n\nฉันอยู่ที่นี่เพื่อช่วยคุณเติบโต ไม่ตัดสิน และไม่กดดัน ลองถามฉันเกี่ยวกับการโฟกัส การสะท้อนคิด การจัดการเวลา หรืออะไรก็ตามที่คุณอยากปรึกษา\n\nวันนี้คุณต้องการความช่วยเหลือด้านไหน?",
    timestamp: new Date(),
  },
];

const SUGGESTED_PROMPTS_TH = [
  "ฉันรู้สึกท่วมท้นกับงานที่มีเยอะมาก ช่วยแนะนำได้ไหม?",
  "ฉันจะจัดการสมาธิให้ดีขึ้นได้อย่างไร?",
  "ช่วยตั้งคำถามสะท้อนคิดสำหรับวันนี้ให้หน่อยได้ไหม?",
  "ฉันรู้สึกเหนื่อยและหมดแรงบันดาลใจ จะทำอย่างไรดี?",
];

const SUGGESTED_PROMPTS_EN = [
  "I'm feeling overwhelmed with too many tasks. Can you help?",
  "How can I improve my focus and concentration?",
  "Can you give me a reflection prompt for today?",
  "I'm feeling tired and unmotivated. What should I do?",
];

const DEMO_RESPONSES: Record<string, string> = {
  default: "ขอบคุณที่ไว้วางใจเล่าให้ฟัง 🙏\n\nฉันเข้าใจว่าการเรียนในมหาวิทยาลัยอาจรู้สึกท้าทายบางครั้ง\n\nลองทำสิ่งเล็กๆ อย่างหนึ่งก่อนเลย: หายใจลึกๆ 3 ครั้ง แล้วถามตัวเองว่า \"สิ่งที่สำคัญที่สุดที่ฉันทำได้ในตอนนี้คืออะไร?\"\n\nคุณไม่ต้องแก้ทุกอย่างพร้อมกัน ทีละก้าวก็พอ 💪",
  overwhelmed: "ความรู้สึกท่วมท้นเป็นสัญญาณว่าคุณสนใจผลลัพธ์ที่ดี นั่นเป็นเรื่องดี! 🌟\n\nลองลิสต์งานทั้งหมดออกมาก่อน แล้วเลือกแค่ 3 อย่างที่สำคัญที่สุดสำหรับวันนี้\n\nจำไว้ว่า: การทำน้อยแต่ดีกว่า ดีกว่าทำทุกอย่างแบบครึ่งๆ กลางๆ นะ",
  focus: "เรื่องสมาธินี่น่าสนใจมาก! 🎯\n\nสิ่งที่ช่วยได้ทันที:\n1. ปิดการแจ้งเตือนทั้งหมด 25 นาที\n2. ทำงานเดียวต่อครั้ง (single-tasking)\n3. ลอง Pomodoro: โฟกัส 25 นาที พัก 5 นาที\n\nสมองชอบความชัดเจน ลองบอกตัวเองว่า 'ฉันจะทำ [งานนี้] จนกว่าจะเสร็จ' ก่อนเริ่ม",
  tired: "ความเหนื่อยล้าเป็นสัญญาณสำคัญที่ร่างกายและจิตใจส่งมาให้คุณ 💚\n\nลองถามตัวเองว่า:\n• นอนหลับพอไหม?\n• ได้ออกกำลังกายบ้างไหม?\n• ได้คุยกับเพื่อนหรือคนใกล้ชิดไหม?\n\nบางครั้งการพักผ่อนจริงๆ ก็เป็นสิ่งที่ productive ที่สุด อย่ากดดันตัวเองนะ 🌙",
};

export default function AICoachPage() {
  const { language } = useI18nStore();
  const { user } = useAuthStore();
  const t = translations[language];
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeCoach, setActiveCoach] = useState<AICoachType>("productivity");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    let responseContent = DEMO_RESPONSES.default;
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes("ท่วมท้น") || lowerContent.includes("overwhelmed") || lowerContent.includes("เยอะมาก")) {
      responseContent = DEMO_RESPONSES.overwhelmed;
    } else if (lowerContent.includes("สมาธิ") || lowerContent.includes("โฟกัส") || lowerContent.includes("focus")) {
      responseContent = DEMO_RESPONSES.focus;
    } else if (lowerContent.includes("เหนื่อย") || lowerContent.includes("tired") || lowerContent.includes("หมดแรง")) {
      responseContent = DEMO_RESPONSES.tired;
    }

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseContent,
      timestamp: new Date(),
      coachType: activeCoach,
    };
    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const suggestedPrompts = language === "th" ? SUGGESTED_PROMPTS_TH : SUGGESTED_PROMPTS_EN;

  return (
    <AppLayout title={t.student.aiCoach.title}>
      <div className="max-w-3xl mx-auto h-[calc(100vh-10rem)] flex flex-col gap-4">
        {/* Coach Type Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
          {COACH_TYPES.map(({ type, emojiTh, labelTh, labelEn, color }) => (
            <button
              key={type}
              onClick={() => setActiveCoach(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeCoach === type ? color + " ring-2 ring-offset-1 ring-brand-300" : "bg-white text-gray-500 shadow-card"
              }`}
            >
              <span>{emojiTh}</span>
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
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand-600 text-white"
                    : "bg-gray-50 text-gray-800"
                }`}>
                  {msg.content.split("\n").map((line, i) => (
                    <span key={i}>{line}{i < msg.content.split("\n").length - 1 && <br />}</span>
                  ))}
                  <p className={`text-xs mt-1 ${msg.role === "user" ? "text-white/60" : "text-gray-400"}`}>
                    {msg.timestamp.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            ))}

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

          {/* Suggested prompts */}
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
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping} className="h-12 w-12 rounded-xl shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
