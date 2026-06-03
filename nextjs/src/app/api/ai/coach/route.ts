import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface CoachRequest {
  message: string;
  coachType: string;
  context?: Record<string, unknown>;
}

/** Detect language from message content using Thai Unicode block U+0E00–U+0E7F */
function detectLang(message: string): "th" | "en" {
  return /[฀-๿]/.test(message) ? "th" : "en";
}

// ─────────────────────────────────────────────────────────────────
// SYSTEM PROMPT — Human-Centered Reflective Coaching
// Philosophy: "Trust by Default, Reflection by Design"
// ─────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are GrowthOS AI Coach — a compassionate, human-centered growth companion for university students.

## Core Identity
You are a trusted friend and reflective coach, NOT an authority, monitor, or evaluator.
You believe in every student's capacity to grow, and you meet them exactly where they are.

## Core Philosophy: "Trust by Default, Reflection by Design"
- Begin every interaction with trust and warmth
- Guide through questions, not commands
- Support self-awareness, not compliance
- Celebrate effort and honesty, not just results
- You are a safe space — students should never feel watched, judged, or pressured

## Communication Style
- Warm, calm, and genuinely caring — like a trusted friend who happens to be a coach
- Gender-neutral language always — NO gendered particles or pronouns
- NO ครับ / ค่ะ / นะคะ / นะครับ (Thai) — use neutral endings: นะ, เลย, สิ, นะ
- Short, conversational sentences — not formal or clinical
- Ask ONE reflective question at a time — do not overwhelm
- Validate emotions before offering suggestions
- Never say "you failed", "you should", or "you must"

## Reflective Coaching Approach
When a student logs an activity or shares something, respond with:
1. Acknowledge and validate their feeling/experience first
2. Ask a meaningful reflective question to deepen self-awareness
3. Offer a gentle, practical insight only if helpful

Examples of reflective questions:
- After exercise: "รู้สึกยังไงบ้างหลังออกกำลังกาย? มีอะไรที่ทำให้รู้สึกแตกต่างจากวันอื่นไหม?"
- After studying: "ช่วงไหนที่รู้สึกว่าตัวเองโฟกัสได้ดีที่สุดวันนี้? มีอะไรที่ยังค้างอยู่ในหัวไหม?"
- When stressed: "ขอบคุณที่เล่าให้ฟัง ความเครียดที่รู้สึกอยู่ตอนนี้ — มันหนักแค่ไหนในสเกล 1-10?"

## Pattern Recognition & Burnout Support
If patterns suggest burnout, overwork, or withdrawal — respond with extra care:
- Acknowledge the pattern gently WITHOUT accusation
- Offer support and space, not solutions
- Always suggest human support when needed

## Ethical Boundaries
- You are NOT a therapist and do NOT diagnose anything
- For serious mental health concerns, always gently suggest university counseling
- Never manipulate, guilt-trip, or create dependency
- Respect privacy — never repeat back data as surveillance

## Language Rule (HIGHEST PRIORITY)
Always reply in the EXACT same language the user writes in.
- Thai message → Thai reply (gender-neutral, warm)
- English message → English reply (warm, coach-like)
- Never switch languages

## Mental Health Referral (add when appropriate, not always)
Thai: "ถ้ารู้สึกหนักมาก การพูดคุยกับนักจิตวิทยาของมหาวิทยาลัยก็เป็นทางเลือกที่ดีนะ — ไม่มีอะไรต้องอาย 💚"
English: "If things feel really heavy, reaching out to your university counselor is always a good option — there's no shame in asking for support 💚"

Keep responses to 2-4 short paragraphs. Use emojis sparingly and only when they add warmth.`;

// ─────────────────────────────────────────────────────────────────
// POST handler
// ─────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let lang: "th" | "en" = "th";

  try {
    const { message, coachType }: CoachRequest = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    lang = detectLang(message);

    const apiKey = process.env.OPENAI_API_KEY;
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

    if (isDemoMode || !apiKey || apiKey === "demo-key") {
      const demoResponse = getDemoResponse(message, coachType, lang);
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
          { role: "user", content: `[Coach Mode: ${coachType}]\n\n${message}` },
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const fallback =
      lang === "en"
        ? "Something went wrong. Please try again."
        : "เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะ";
    const reply = data.choices?.[0]?.message?.content || fallback;

    return NextResponse.json({ response: reply });
  } catch (error) {
    console.error("AI Coach error:", error);
    const errMsg =
      lang === "en"
        ? "I'm having trouble connecting right now. Try again in a moment 🙏"
        : "ขอโทษนะ ตอนนี้เชื่อมต่อไม่ได้ ลองอีกสักครู่ 🙏";
    return NextResponse.json({ response: errMsg }, { status: 200 });
  }
}

// ─────────────────────────────────────────────────────────────────
// Demo responses — empathetic, reflective, gender-neutral
// ─────────────────────────────────────────────────────────────────
function getDemoResponse(message: string, coachType: string, lang: "th" | "en"): string {
  const lower = message.toLowerCase();

  /* ── English ── */
  if (lang === "en") {
    if (lower.includes("tired") || lower.includes("exhausted") || lower.includes("burnout") || lower.includes("unmotivated")) {
      return "Thank you for sharing that — it takes honesty to name what you're feeling 💚\n\nFeeling tired isn't a sign of weakness. It's your system asking for something. Before we think about solutions, I'm curious: on a scale of 1–10, how heavy does this tiredness feel right now?\n\nAnd is it more physical, emotional, or both?";
    }
    if (lower.includes("overwhelm") || lower.includes("too much") || lower.includes("stress") || lower.includes("anxious")) {
      return "That sense of overwhelm is real, and it makes complete sense given everything you're carrying 🌿\n\nLet's slow down for a second. If you could set aside just ONE thing from your plate today — not delete it, just pause it — what would it be?\n\nSometimes naming that one thing creates just enough breathing room to think more clearly.";
    }
    if (lower.includes("focus") || lower.includes("concentrate") || lower.includes("distract")) {
      return "Focus is one of those things that's hard to force but easy to invite 🎯\n\nBefore jumping to techniques — when was the last time you felt genuinely absorbed in something? What made that moment different?\n\nUnderstanding your own focus patterns is more powerful than any productivity hack.";
    }
    if (lower.includes("motivat") || lower.includes("giving up") || lower.includes("can't") || lower.includes("lost")) {
      return "Motivation often hides behind meaning. When we lose it, it's worth asking: what originally mattered about this to me?\n\nYou don't have to feel motivated to take a small step. Sometimes action creates the feeling, not the other way around.\n\nWhat's the tiniest thing — 5 minutes or less — that would feel like progress today? ✨";
    }

    switch (coachType) {
      case "reflection":
        return "Reflection is one of the most honest gifts you can give yourself 📝\n\nInstead of asking 'what did I do today,' try asking: 'what surprised me today?' or 'what would I do differently if I could?'\n\nEven three sentences of honest reflection beats a page of what you think you should write.";
      case "wellbeing":
        return "Wellbeing isn't just about feeling good — it's about feeling real 💚\n\nA simple check-in: right now, what does your body need that it hasn't gotten today? Sleep, movement, silence, connection?\n\nYou don't have to fix everything. Just one small thing.";
      case "productivity":
        return "Productivity at its best is about doing what matters — not doing more 🌱\n\nWhat's the one task that, if done today, would make everything else feel lighter?\n\nStart there. Just one. The rest can wait.";
      default:
        return "Hey, glad you're here 🌱\n\nThis is a space to think out loud, reflect, and figure things out — without judgment. Whatever's on your mind, we can explore it together.\n\nWhat would feel most useful to talk through today?";
    }
  }

  /* ── Thai (gender-neutral, warm, reflective) ── */
  if (lower.includes("เหนื่อย") || lower.includes("หมดแรง") || lower.includes("ท้อ") || lower.includes("หมดไฟ")) {
    return "ขอบคุณที่เล่าให้ฟังนะ — การยอมรับความรู้สึกแบบนี้ต้องใช้ความกล้ามากเลย 💚\n\nความเหนื่อยไม่ได้บอกว่าเราไม่เก่ง แต่มันบอกว่ามีอะไรบางอย่างที่ร่างกายหรือจิตใจต้องการ\n\nก่อนที่จะคิดเรื่องอื่น อยากถามว่า — ความเหนื่อยที่รู้สึกอยู่ตอนนี้ถ้าให้คะแนน 1-10 มันอยู่ที่เท่าไหร่? และมันหนักแบบร่างกาย ใจ หรือทั้งคู่?";
  }
  if (lower.includes("เครียด") || lower.includes("กังวล") || lower.includes("ท่วมท้น") || lower.includes("หนักมาก")) {
    return "ความรู้สึกท่วมท้นแบบนี้มันจริงมาก และเข้าใจได้เลยว่าทำไมถึงรู้สึกแบบนี้ 🌿\n\nลองหยุดสักแป๊บนึงก่อนนะ ถ้าวันนี้เอาอะไรออกจากรายการได้สักหนึ่งอย่าง — ไม่ต้องลบทิ้ง แค่พักไว้ก่อน — จะเป็นอะไร?\n\nบางทีแค่ตั้งชื่อสิ่งนั้นได้ก็ทำให้หายใจได้ลึกขึ้นแล้ว";
  }
  if (lower.includes("สมาธิ") || lower.includes("โฟกัส") || lower.includes("วอกแวก")) {
    return "สมาธิเป็นสิ่งที่บังคับไม่ได้ แต่ชวนมันมาได้ 🎯\n\nก่อนจะไปถึงเทคนิคต่างๆ — อยากถามว่า ครั้งสุดท้ายที่รู้สึกว่าตัวเองดูดดื่มกับอะไรบางอย่างจริงๆ คือเมื่อไหร่? ตอนนั้นมีอะไรที่ต่างออกไปไหม?\n\nการเข้าใจจังหวะของตัวเองนั้นทรงพลังกว่าเทคนิคไหนๆ เลย";
  }
  if (lower.includes("หมดแรงบันดาลใจ") || lower.includes("ไม่อยากทำ") || lower.includes("ท้อแท้") || lower.includes("สูญเสีย")) {
    return "แรงบันดาลใจมักซ่อนอยู่หลังความหมาย เวลาที่มันหายไป บางทีมันเป็นสัญญาณให้ถามว่า — ตอนแรกที่เริ่มทำสิ่งนี้ เราสนใจเพราะอะไร?\n\nไม่จำเป็นต้องรู้สึกมีแรงบันดาลใจก่อนถึงจะลงมือทำนะ บางครั้งการลงมือมันสร้างความรู้สึกนั้นขึ้นมาเอง\n\nวันนี้มีอะไรเล็กๆ — แค่ 5 นาที — ที่ถ้าทำแล้วจะรู้สึกว่าเดินหน้าไปหน่อยได้ไหม? ✨";
  }

  switch (coachType) {
    case "reflection":
      return "การสะท้อนคิดคือของขวัญที่ซื่อสัตย์ที่สุดที่ให้ตัวเองได้ 📝\n\nแทนที่จะถามว่า 'วันนี้ทำอะไรไปบ้าง' ลองถามว่า 'อะไรที่ทำให้แปลกใจวันนี้?' หรือ 'ถ้าย้อนกลับไปได้ จะเปลี่ยนอะไร?'\n\nสามประโยคที่ซื่อสัตย์มีค่ากว่าหน้ากระดาษของสิ่งที่คิดว่าควรเขียนเยอะมาก";
    case "wellbeing":
      return "สุขภาวะที่ดีไม่ได้แปลว่าต้องรู้สึกดีตลอดเวลา — แต่คือการรู้สึกอยู่กับตัวเองได้จริงๆ 💚\n\nเช็คอินง่ายๆ: ตอนนี้ร่างกายต้องการอะไรที่ยังไม่ได้รับวันนี้? นอน เคลื่อนไหว ความเงียบ หรือการพูดคุย?\n\nไม่ต้องแก้ทุกอย่าง แค่สิ่งเดียวก็พอ";
    case "productivity":
      return "ผลิตภาพที่แท้จริงคือการทำในสิ่งที่สำคัญ ไม่ใช่การทำให้มากขึ้น 🌱\n\nถ้าวันนี้ทำสิ่งเดียวแล้วรู้สึกว่าทุกอย่างเบาลง — มันจะเป็นอะไร?\n\nเริ่มจากนั้นก่อน สิ่งอื่นรอได้";
    default:
      return "ยินดีที่ได้คุยด้วยนะ 🌱\n\nที่นี่คือพื้นที่ปลอดภัยสำหรับคิดออกเสียง สะท้อน และคลี่คลายสิ่งต่างๆ — ไม่มีการตัดสิน ไม่มีคำตอบที่ถูกหรือผิด\n\nวันนี้อยากพูดถึงอะไรที่สุด?";
  }
}
