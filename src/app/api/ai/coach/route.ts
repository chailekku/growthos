import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface CoachRequest {
  message: string;
  coachType: string;
  context?: Record<string, unknown>;
}

const SYSTEM_PROMPT = `You are GrowthOS AI Coach, a compassionate and ethical AI companion designed for Thai university students.

Core principles:
- Be warm, supportive, and non-judgmental
- Never shame or pressure users
- Promote healthy balance, not toxic productivity
- Encourage self-reflection and growth mindset
- Support wellbeing, not just academic performance
- When discussing stress or mental health, always suggest seeking human support
- You are NOT a therapist and do NOT diagnose conditions
- Respond in Thai by default, unless the user writes in English
- Keep responses concise (2-4 paragraphs max)
- Use encouraging emojis sparingly

If asked about mental health concerns, always add: "หากรู้สึกแย่มากหรือต้องการความช่วยเหลือเพิ่มเติม ลองพูดคุยกับนักจิตวิทยาหรือที่ปรึกษาของมหาวิทยาลัยนะคะ 💚"`;

export async function POST(req: NextRequest) {
  try {
    const { message, coachType, context }: CoachRequest = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

    if (isDemoMode || !apiKey || apiKey === "demo-key") {
      const demoResponse = getDemoResponse(message, coachType);
      await new Promise((r) => setTimeout(r, 800));
      return NextResponse.json({ response: demoResponse });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `[Coach Type: ${coachType}]\n\n${message}` },
        ],
        max_tokens: 500,
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";

    return NextResponse.json({ response: reply });
  } catch (error) {
    console.error("AI Coach error:", error);
    return NextResponse.json(
      { response: "ขออภัย ไม่สามารถตอบได้ในขณะนี้ กรุณาลองใหม่สักครู่ 🙏" },
      { status: 200 }
    );
  }
}

function getDemoResponse(message: string, coachType: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("เหนื่อย") || lower.includes("tired") || lower.includes("หมดแรง")) {
    return "ขอบคุณที่บอกฉันนะ 💚\n\nความรู้สึกเหนื่อยเป็นสัญญาณสำคัญจากร่างกายและจิตใจ บางครั้งสิ่งที่ productive ที่สุดคือการพักผ่อนจริงๆ\n\nลองถามตัวเองว่า: ในช่วงนี้ฉันดูแลตัวเองได้ดีพอไหม? นอนหลับครบไหม? ได้ทำสิ่งที่ชอบบ้างไหม?\n\nถ้าความรู้สึกนี้ยังคงอยู่นาน ลองพูดคุยกับนักจิตวิทยาของมหาวิทยาลัยนะ 💜";
  }

  if (lower.includes("focus") || lower.includes("สมาธิ") || lower.includes("โฟกัส")) {
    return "เรื่องสมาธิเป็นทักษะที่ฝึกได้ ไม่ใช่พรสวรรค์ 🎯\n\nเทคนิคที่ได้ผลจริง:\n• ลอง Pomodoro: โฟกัส 25 นาที พัก 5 นาที\n• ปิดการแจ้งเตือนทุกอย่างก่อนเริ่ม\n• บอกตัวเองว่าจะทำ 'แค่ 5 นาที' มักจะทำต่อได้เอง\n\nสมาธิมักดีที่สุดในช่วงเช้า ลองสังเกตจังหวะของตัวเองด้วยนะ ✨";
  }

  if (lower.includes("เครียด") || lower.includes("stress") || lower.includes("กังวล")) {
    return "ความเครียดที่คุณรู้สึกอยู่นั้นเป็นเรื่องปกติมาก โดยเฉพาะในช่วงที่มีงานเยอะ 🌱\n\nลองทำสิ่งเล็กๆ เหล่านี้:\n• หายใจลึกๆ 4-7-8 (หายใจเข้า 4 วินาที กลั้น 7 วินาที หายใจออก 8 วินาที)\n• เขียนสิ่งที่กังวลออกมา แล้วถามว่า 'ฉันควบคุมสิ่งนี้ได้ไหม?'\n\nหากรู้สึกแย่มาก อย่าลืมว่ามีผู้เชี่ยวชาญที่พร้อมช่วยเสมอนะ 💚";
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
