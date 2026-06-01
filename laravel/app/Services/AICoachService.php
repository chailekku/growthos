<?php

namespace App\Services;

use App\Models\AiFeedback;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class AICoachService
{
    private string $model;
    private int $maxTokens;

    public function __construct()
    {
        $this->model     = config('ai.model', 'gpt-4o-mini');
        $this->maxTokens = config('ai.max_tokens', 600);
    }

    public function chat(User $user, string $message, string $coachType = 'productivity'): string
    {
        if (config('app.demo_mode', false) || empty(config('openai.api_key'))) {
            return $this->demoResponse($message, $coachType);
        }

        $systemPrompt = $this->buildSystemPrompt($coachType, $user);

        try {
            $response = Http::withToken(config('openai.api_key'))
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model'      => $this->model,
                    'max_tokens' => $this->maxTokens,
                    'temperature' => 0.75,
                    'messages'   => [
                        ['role' => 'system',  'content' => $systemPrompt],
                        ['role' => 'user',    'content' => "[Coach: {$coachType}]\n\n{$message}"],
                    ],
                ])->throw()->json();

            $reply  = $response['choices'][0]['message']['content'] ?? '';
            $tokens = $response['usage']['total_tokens'] ?? 0;

            AiFeedback::create([
                'user_id'    => $user->id,
                'coach_type' => $coachType,
                'prompt'     => $message,
                'response'   => $reply,
                'model_used' => $this->model,
                'tokens_used' => $tokens,
            ]);

            return $reply;
        } catch (\Exception $e) {
            return 'ขออภัย ไม่สามารถเชื่อมต่อกับ AI Coach ได้ในขณะนี้ กรุณาลองใหม่สักครู่ 🙏';
        }
    }

    public function generateReflectionInsight(string $content, User $user): string
    {
        if (config('app.demo_mode', false)) {
            return 'ขอบคุณสำหรับการสะท้อนคิดที่ลึกซึ้ง 🌱 จากที่คุณเขียน ดูเหมือนว่าคุณกำลังพัฒนา Growth Mindset อย่างต่อเนื่อง ความท้าทายที่คุณเผชิญเป็นโอกาสในการเติบโตที่มีค่ามาก ลองสังเกตรูปแบบความคิดและพฤติกรรมที่ช่วยให้คุณก้าวผ่านความยากได้นะ ✨';
        }

        return $this->chat($user, "วิเคราะห์การสะท้อนคิดนี้และให้ insight ที่ supportive และ growth-focused (2-3 ประโยค): {$content}", 'reflection');
    }

    private function buildSystemPrompt(string $coachType, User $user): string
    {
        $lang = $user->language === 'en' ? 'English' : 'Thai (ภาษาไทย)';

        return <<<PROMPT
        You are GrowthOS AI Coach — a compassionate, ethical AI companion for Thai university students at Khon Kaen University (KKU).

        Core principles:
        - Be warm, supportive, and non-judgmental at all times
        - NEVER shame, pressure, or compare users negatively
        - Promote healthy balance — not toxic productivity
        - Support emotional wellbeing alongside academic success
        - You are NOT a therapist. Never diagnose. If mental health concerns arise, always suggest human support.
        - Respond in {$lang} by default
        - Keep responses concise (2-4 paragraphs max)
        - Use encouraging emojis sparingly

        Current coach mode: {$coachType}
        Student name: {$user->name}

        If the user mentions severe distress, always add:
        "หากรู้สึกแย่มากหรือต้องการความช่วยเหลือ ลองพูดคุยกับนักจิตวิทยาที่ศูนย์บริการนักศึกษา มข. นะคะ 💚"
        PROMPT;
    }

    private function demoResponse(string $message, string $coachType): string
    {
        $lower = mb_strtolower($message);

        if (str_contains($lower, 'เหนื่อย') || str_contains($lower, 'หมดแรง') || str_contains($lower, 'tired')) {
            return "ความรู้สึกเหนื่อยเป็นสัญญาณสำคัญจากร่างกายและจิตใจ 💚\n\nบางครั้งสิ่งที่ productive ที่สุดคือการพักผ่อนจริงๆ ลองถามตัวเองว่า ช่วงนี้ดูแลตัวเองได้ดีพอไหม? นอนหลับครบ? ได้ทำสิ่งที่ชอบบ้างไหม?\n\nถ้าความรู้สึกนี้ยังคงอยู่ อย่าลืมว่ามีนักจิตวิทยาที่ศูนย์บริการนักศึกษา มข. พร้อมช่วยเสมอ 💜";
        }

        if (str_contains($lower, 'สมาธิ') || str_contains($lower, 'โฟกัส') || str_contains($lower, 'focus')) {
            return "สมาธิเป็นทักษะที่ฝึกได้ ไม่ใช่พรสวรรค์ 🎯\n\nเทคนิคที่ได้ผลจริง:\n• Pomodoro: โฟกัส 25 นาที พัก 5 นาที\n• ปิดการแจ้งเตือนทุกอย่างก่อนเริ่ม\n• บอกตัวเองว่าจะทำ 'แค่ 5 นาที' — มักจะทำต่อได้เองนะ\n\nลองใช้ Focus Mode ใน GrowthOS ได้เลย! ✨";
        }

        if (str_contains($lower, 'เครียด') || str_contains($lower, 'กังวล') || str_contains($lower, 'stress')) {
            return "ความเครียดที่คุณรู้สึกนั้นเป็นเรื่องปกติมาก โดยเฉพาะช่วงสอบหรืองานเยอะ 🌱\n\nลองทำ 4-7-8 breathing: หายใจเข้า 4 วินาที → กลั้น 7 วินาที → หายใจออก 8 วินาที\n\nแล้วลิสต์งานที่กังวลออกมาทั้งหมด แล้วถามว่า 'ฉันควบคุมสิ่งนี้ได้ไหม?' — สิ่งที่ควบคุมไม่ได้ ปล่อยวางไว้ก่อนนะ 😊";
        }

        return match ($coachType) {
            'productivity'    => "ขอบคุณที่ปรึกษานะ 😊\n\nสำหรับผลิตภาพที่ดี ลองเริ่มวันด้วยการเลือก **3 งานสำคัญที่สุด** ที่ถ้าทำเสร็จวันนี้จะรู้สึกดี แล้วทำทีละชิ้นจนเสร็จก่อนไปชิ้นถัดไป\n\nจำไว้ว่า 'ยุ่ง' ≠ 'productive' นะ ✨",
            'reflection'      => "การสะท้อนคิดเป็นของขวัญที่ให้ตัวเอง 📝\n\nลองถาม: วันนี้ฉันได้เรียนรู้อะไร? มีช่วงไหนที่รู้สึกดีหรือท้าทายพิเศษ? ฉันจะปรับอะไรวันพรุ่งนี้?\n\nไม่ต้องเขียนเยอะ 3-5 ประโยคก็พอ สิ่งสำคัญคือความสม่ำเสมอ 🌱",
            'focus'           => "เรื่องการโฟกัสนี้ดีมากเลย! 🎯\n\nลอง Deep Work 60 นาที: ปิดทุกการแจ้งเตือน → ทำงานชิ้นเดียวที่ต้องใช้ความคิดมาก → จดทุกอย่างที่คิดขึ้นมา (distraction list) ไว้ทำทีหลัง\n\nFlow state มักเกิดหลัง 15-20 นาที อดทนไว้นะ 💪",
            'wellbeing'       => "สุขภาวะที่ดีเป็นรากฐานของทุกอย่าง 💚\n\nตรวจสอบ 4 เสาหลัก: 🛌 นอนหลับพอ? 🏃 ออกกำลังกาย? 🧘 เวลาส่วนตัว? 👥 ได้คุยกับคนที่ชอบไหม?\n\nขาดข้อไหน เพิ่มข้อนั้นในสัปดาห์นี้ก็พอ 🌸",
            'self_leadership' => "Self-leadership เริ่มจากการรู้จักตัวเอง 🌟\n\nถามตัวเอง: ค่านิยมที่สำคัญที่สุดของฉันคืออะไร? การกระทำของฉันสอดคล้องกับสิ่งนั้นไหม?\n\nผู้นำที่แท้จริงนำตัวเองก่อน แล้วค่อยนำผู้อื่น ✨",
            default           => "ขอบคุณที่ไว้วางใจ GrowthOS AI Coach 🌱\n\nฉันอยู่ที่นี่เพื่อช่วยให้คุณเติบโตในแบบที่ยั่งยืนและมีความสุข บอกฉันได้เลยว่าวันนี้ต้องการความช่วยเหลือด้านไหน ✨",
        };
    }
}
