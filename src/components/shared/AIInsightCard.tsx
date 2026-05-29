"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AIInsightCardProps {
  insight: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  title?: string;
}

const DEMO_INSIGHTS = [
  "วันนี้คุณโฟกัสได้ดีมาก! ลองสังเกตดูว่าช่วงเวลาไหนที่คุณมีสมาธิสูงสุด และวางแผนงานที่ต้องใช้ความคิดสูงในช่วงนั้น 🧠",
  "คุณมี streak 7 วันติดต่อกัน — นั่นแสดงถึงความมุ่งมั่นที่น่าชื่นชม! ความสม่ำเสมอคือรากฐานของการเติบโตที่ยั่งยืน ✨",
  "จากรูปแบบการสะท้อนคิดของคุณ ดูเหมือนว่าคุณกำลังพัฒนา Growth Mindset อย่างต่อเนื่อง ความท้าทายที่คุณพบเป็นโอกาสในการเรียนรู้ 🌱",
  "อย่าลืมพักผ่อนด้วยนะ! การพักอย่างมีคุณภาพช่วยให้สมองประมวลผลสิ่งที่เรียนรู้ได้ดีขึ้น หลังจากโฟกัสหนัก ลองเดินสั้นๆ หรือหายใจลึกๆ 😊",
];

export function AIInsightCard({ insight, isLoading, onRefresh, title = "AI Insight" }: AIInsightCardProps) {
  const [currentInsight, setCurrentInsight] = useState(insight || DEMO_INSIGHTS[0]);
  const [insightIndex, setInsightIndex] = useState(0);

  const handleRefresh = () => {
    const next = (insightIndex + 1) % DEMO_INSIGHTS.length;
    setInsightIndex(next);
    setCurrentInsight(DEMO_INSIGHTS[next]);
    onRefresh?.();
  };

  return (
    <Card className="bg-gradient-to-br from-brand-50 to-purple-50 border-brand-100">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-brand-100 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-brand-600" />
            </div>
            <span className="text-sm font-semibold text-brand-700">{title}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRefresh} className="h-7 w-7 rounded-lg">
            <RefreshCw className={`h-3.5 w-3.5 text-gray-400 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <motion.p
          key={currentInsight}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-700 leading-relaxed"
        >
          {currentInsight}
        </motion.p>
      </CardContent>
    </Card>
  );
}
