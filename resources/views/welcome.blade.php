<!DOCTYPE html>
<html lang="th" x-data="landing()" x-init="init()">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>KKU GrowthOS — AI-Powered Student Growth Platform | KKU</title>
    <meta name="description" content="แพลตฟอร์ม AI เพื่อการเติบโตของนักศึกษา มหาวิทยาลัยขอนแก่น — Focus, Reflect, Grow">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-white antialiased">

{{-- ═══════════════════════════════════════════
     STICKY HEADER
═══════════════════════════════════════════ --}}
<header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {{-- Logo --}}
        <div class="flex items-center gap-2.5">
            <div class="h-8 w-8 rounded-xl bg-brand-600 flex items-center justify-center">
                <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    <path d="M5 3v4M19 17v4M3 5h4M17 19h4"/>
                </svg>
            </div>
            <span class="font-bold text-gray-900 text-sm">KKU GrowthOS</span>
        </div>

        {{-- Nav --}}
        <div class="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" class="hover:text-brand-600 transition-colors" x-text="lang==='th' ? 'ฟีเจอร์' : 'Features'"></a>
            <a href="#roles" class="hover:text-brand-600 transition-colors" x-text="lang==='th' ? 'สำหรับใคร' : 'For Who'"></a>
            <a href="#how" class="hover:text-brand-600 transition-colors" x-text="lang==='th' ? 'วิธีใช้งาน' : 'How It Works'"></a>
        </div>

        <div class="flex items-center gap-2">
            {{-- Language toggle --}}
            <button @click="toggleLang()"
                    class="text-xs px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium transition-colors">
                <span x-text="lang === 'th' ? '🌐 EN' : '🌐 ไทย'"></span>
            </button>
            <a href="{{ route('login') }}"
               class="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors px-3 py-1.5 hidden sm:inline">
                <span x-text="lang==='th' ? 'เข้าสู่ระบบ' : 'Login'"></span>
            </a>
            <a href="{{ route('login') }}"
               class="btn-primary py-2 text-xs shadow-glow">
                <span x-text="lang==='th' ? 'เริ่มต้น →' : 'Get Started →'"></span>
            </a>
        </div>
    </div>
</header>

{{-- ═══════════════════════════════════════════
     HERO
═══════════════════════════════════════════ --}}
<section class="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-brand-50 pt-20 pb-24 px-4">
    {{-- Background decoration --}}
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-100 opacity-40 blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-100 opacity-40 blur-3xl"></div>
    </div>

    <div class="relative max-w-4xl mx-auto text-center">
        {{-- Badge --}}
        <div class="inline-flex items-center gap-2 bg-brand-50 text-brand-700 rounded-full px-4 py-2 text-sm font-medium mb-6 animate-fade-in border border-brand-100">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
            <span x-show="lang==='th'">แพลตฟอร์ม AI เพื่อการเติบโตของนักศึกษา มข.</span>
            <span x-show="lang!=='th'">AI-Powered Student Growth Platform · KKU</span>
        </div>

        {{-- Headline --}}
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up tracking-tight">
            <span x-show="lang==='th'">
                โครงสร้างพื้นฐาน<br>
                <span class="text-brand-600">การเติบโตส่วนบุคคล</span>
            </span>
            <span x-show="lang!=='th'">
                Personal Growth<br>
                <span class="text-brand-600">Infrastructure</span>
            </span>
        </h1>

        {{-- Subheadline --}}
        <p class="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            <span x-show="lang==='th'">แพลตฟอร์ม AI ที่ออกแบบมาเพื่อช่วยนักศึกษาเติบโตทางวิชาการ อารมณ์ พฤติกรรม และเป็นผู้นำในอนาคต</span>
            <span x-show="lang!=='th'">An AI ecosystem designed to help university students grow academically, emotionally, and as future leaders.</span>
        </p>

        {{-- CTA Buttons --}}
        <div class="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up mb-16">
            <a href="{{ route('login') }}"
               class="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-600 text-white font-semibold rounded-2xl hover:bg-brand-700 shadow-glow transition-all hover:scale-105 text-sm">
                <span x-text="lang==='th' ? 'เริ่มต้นใช้งาน' : 'Get Started Free'"></span>
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
            <a href="{{ route('login') }}"
               class="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-700 font-medium rounded-2xl border border-gray-200 hover:border-brand-300 hover:text-brand-700 transition-all text-sm">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="10 8 16 12 10 16 10 8"/></svg>
                <span x-text="lang==='th' ? 'ทดลองใช้ Demo' : 'Try Demo Mode'"></span>
            </a>
        </div>

        {{-- Role Pills --}}
        <div class="flex flex-wrap justify-center gap-3 animate-fade-in" id="roles">
            <div class="flex items-center gap-2 bg-white rounded-2xl px-5 py-3 shadow-card border border-gray-100 hover:border-brand-200 transition-colors">
                <span class="text-xl">🎓</span>
                <span class="text-sm font-medium text-gray-700" x-text="lang==='th' ? 'นักศึกษา' : 'Students'"></span>
            </div>
            <div class="flex items-center gap-2 bg-white rounded-2xl px-5 py-3 shadow-card border border-gray-100 hover:border-calm-200 transition-colors">
                <span class="text-xl">👩‍🏫</span>
                <span class="text-sm font-medium text-gray-700" x-text="lang==='th' ? 'อาจารย์' : 'Teachers'"></span>
            </div>
            <div class="flex items-center gap-2 bg-white rounded-2xl px-5 py-3 shadow-card border border-gray-100 hover:border-purple-200 transition-colors">
                <span class="text-xl">💜</span>
                <span class="text-sm font-medium text-gray-700" x-text="lang==='th' ? 'นักจิตวิทยา' : 'Psychologists'"></span>
            </div>
            <div class="flex items-center gap-2 bg-white rounded-2xl px-5 py-3 shadow-card border border-gray-100 hover:border-gray-300 transition-colors">
                <span class="text-xl">⚙️</span>
                <span class="text-sm font-medium text-gray-700" x-text="lang==='th' ? 'ผู้ดูแลระบบ' : 'Admins'"></span>
            </div>
        </div>
    </div>
</section>

{{-- ═══════════════════════════════════════════
     STATS
═══════════════════════════════════════════ --}}
<section class="bg-white border-y border-gray-100 py-10 px-4">
    <div class="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
            <p class="text-3xl font-bold text-brand-600">6+</p>
            <p class="text-sm text-gray-500 mt-1" x-text="lang==='th' ? 'ฟีเจอร์หลัก' : 'Core Features'"></p>
        </div>
        <div>
            <p class="text-3xl font-bold text-calm-600">4</p>
            <p class="text-sm text-gray-500 mt-1" x-text="lang==='th' ? 'บทบาทผู้ใช้' : 'User Roles'"></p>
        </div>
        <div>
            <p class="text-3xl font-bold text-purple-600">AI</p>
            <p class="text-sm text-gray-500 mt-1" x-text="lang==='th' ? 'โค้ชส่วนตัว' : 'Personal Coach'"></p>
        </div>
        <div>
            <p class="text-3xl font-bold text-warmth-600">KKU</p>
            <p class="text-sm text-gray-500 mt-1" x-text="lang==='th' ? 'มหาวิทยาลัยขอนแก่น' : 'Khon Kaen University'"></p>
        </div>
    </div>
</section>

{{-- ═══════════════════════════════════════════
     FEATURES
═══════════════════════════════════════════ --}}
<section id="features" class="py-20 px-4 bg-gray-50">
    <div class="max-w-6xl mx-auto">
        <div class="text-center mb-14">
            <p class="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3" x-text="lang==='th' ? 'ฟีเจอร์' : 'Features'"></p>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                <span x-show="lang==='th'">ทุกอย่างที่นักศึกษาต้องการ</span>
                <span x-show="lang!=='th'">Everything Students Need</span>
            </h2>
            <p class="text-gray-500 max-w-xl mx-auto">
                <span x-show="lang==='th'">ระบบครบวงจรที่รวม AI coaching, productivity, และ wellbeing ไว้ในที่เดียว</span>
                <span x-show="lang!=='th'">An integrated system combining AI coaching, productivity, and wellbeing in one place</span>
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            @foreach([
                ['icon'=>'timer',     'color'=>'bg-blue-50 text-blue-600',   'border'=>'hover:border-blue-200',   'th_title'=>'AI Focus System',          'en_title'=>'AI Focus System',        'th_desc'=>'Pomodoro อัจฉริยะที่ปรับตัวตามพฤติกรรมของคุณ ช่วยให้โฟกัสได้ลึกและนานขึ้น',    'en_desc'=>'Adaptive Pomodoro that learns your patterns for deeper focus'],
                ['icon'=>'book',      'color'=>'bg-purple-50 text-purple-600','border'=>'hover:border-purple-200', 'th_title'=>'สมุดบันทึกสะท้อนคิด',       'en_title'=>'Reflection Journal',     'th_desc'=>'AI ช่วยตั้งคำถามที่ทำให้คุณเติบโต บันทึกความรู้สึกและบทเรียนในชีวิต',        'en_desc'=>'AI-guided prompts for meaningful self-reflection and personal growth'],
                ['icon'=>'trending',  'color'=>'bg-green-50 text-green-600',  'border'=>'hover:border-green-200',  'th_title'=>'แดชบอร์ดการเติบโต',         'en_title'=>'Growth Dashboard',       'th_desc'=>'ติดตามนิสัย เป้าหมาย และความก้าวหน้าส่วนบุคคลด้วยภาพที่เข้าใจง่าย',            'en_desc'=>'Track habits, goals, and personal progress with intuitive visualizations'],
                ['icon'=>'heart',     'color'=>'bg-rose-50 text-rose-600',    'border'=>'hover:border-rose-200',   'th_title'=>'การสนับสนุนสุขภาวะ',        'en_title'=>'Wellbeing Support',      'th_desc'=>'ตรวจจับสัญญาณความเสี่ยงและสนับสนุนอย่างเป็นมิตร ปกป้องความเป็นส่วนตัว',        'en_desc'=>'Ethical burnout detection and gentle support that respects privacy'],
                ['icon'=>'sparkles',  'color'=>'bg-amber-50 text-amber-600',  'border'=>'hover:border-amber-200',  'th_title'=>'โค้ช AI ส่วนตัว',           'en_title'=>'Personal AI Coach',      'th_desc'=>'โค้ชที่ปรับตัวตามคุณ ไม่ตัดสิน ไม่กดดัน ให้คำแนะนำที่เหมาะกับคุณที่สุด',    'en_desc'=>'Adaptive, judgment-free coaching companion tailored just for you'],
                ['icon'=>'shield',    'color'=>'bg-teal-50 text-teal-600',    'border'=>'hover:border-teal-200',   'th_title'=>'ความเป็นส่วนตัวก่อน',       'en_title'=>'Privacy First',          'th_desc'=>'คุณควบคุมข้อมูลของตัวเองทั้งหมด เลือกได้ว่าจะแชร์อะไรกับใคร',                  'en_desc'=>'You control what data is shared and with whom, always'],
            ] as $feature)
            <div class="bg-white rounded-2xl p-6 shadow-card border border-gray-100 {{ $feature['border'] }} transition-all hover:shadow-md hover:-translate-y-0.5">
                <div class="h-11 w-11 rounded-2xl {{ $feature['color'] }} flex items-center justify-center mb-4">
                    @if($feature['icon'] === 'timer')
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    @elseif($feature['icon'] === 'book')
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    @elseif($feature['icon'] === 'trending')
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                    @elseif($feature['icon'] === 'heart')
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    @elseif($feature['icon'] === 'sparkles')
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                    @else
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    @endif
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">
                    <span x-show="lang==='th'">{{ $feature['th_title'] }}</span>
                    <span x-show="lang!=='th'">{{ $feature['en_title'] }}</span>
                </h3>
                <p class="text-sm text-gray-500 leading-relaxed">
                    <span x-show="lang==='th'">{{ $feature['th_desc'] }}</span>
                    <span x-show="lang!=='th'">{{ $feature['en_desc'] }}</span>
                </p>
            </div>
            @endforeach
        </div>
    </div>
</section>

{{-- ═══════════════════════════════════════════
     HOW IT WORKS
═══════════════════════════════════════════ --}}
<section id="how" class="py-20 px-4 bg-white">
    <div class="max-w-5xl mx-auto">
        <div class="text-center mb-14">
            <p class="text-xs font-semibold text-calm-600 uppercase tracking-widest mb-3" x-text="lang==='th' ? 'ขั้นตอน' : 'How It Works'"></p>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                <span x-show="lang==='th'">เริ่มต้นง่าย ใช้ได้ทันที</span>
                <span x-show="lang!=='th'">Simple to Start, Powerful to Use</span>
            </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {{-- Connector line (desktop) --}}
            <div class="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-brand-200 to-calm-200 -z-0"></div>

            @foreach([
                ['step'=>'01','th_title'=>'เข้าสู่ระบบ','en_title'=>'Sign In','th_desc'=>'ใช้ KKU SSO หรือ Google — ไม่ต้องสมัครบัญชีใหม่','en_desc'=>'Use KKU SSO or Google — no new account needed','icon'=>'login','color'=>'bg-brand-600'],
                ['step'=>'02','th_title'=>'ตั้งค่าเป้าหมาย','en_title'=>'Set Your Goals','th_desc'=>'บอก AI ว่าคุณต้องการเติบโตในด้านไหน แล้วระบบจะปรับให้เหมาะกับคุณ','en_desc'=>'Tell the AI what you want to improve, and the system adapts to you','icon'=>'target','color'=>'bg-calm-600'],
                ['step'=>'03','th_title'=>'เติบโตทุกวัน','en_title'=>'Grow Every Day','th_desc'=>'โฟกัส สะท้อนคิด และติดตามความก้าวหน้า — เห็นผลจริงในทุกวัน','en_desc'=>'Focus, reflect, and track your progress — see real results daily','icon'=>'trending','color'=>'bg-purple-600'],
            ] as $step)
            <div class="relative text-center">
                <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl {{ $step['color'] }} text-white mx-auto mb-5 shadow-lg relative z-10">
                    @if($step['icon'] === 'login')
                        <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                    @elseif($step['icon'] === 'target')
                        <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                    @else
                        <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                    @endif
                </div>
                <div class="text-xs font-bold text-gray-300 mb-2">{{ $step['step'] }}</div>
                <h3 class="font-semibold text-gray-900 text-lg mb-2">
                    <span x-show="lang==='th'">{{ $step['th_title'] }}</span>
                    <span x-show="lang!=='th'">{{ $step['en_title'] }}</span>
                </h3>
                <p class="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                    <span x-show="lang==='th'">{{ $step['th_desc'] }}</span>
                    <span x-show="lang!=='th'">{{ $step['en_desc'] }}</span>
                </p>
            </div>
            @endforeach
        </div>
    </div>
</section>

{{-- ═══════════════════════════════════════════
     ROLES SHOWCASE
═══════════════════════════════════════════ --}}
<section class="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
    <div class="max-w-5xl mx-auto">
        <div class="text-center mb-12">
            <p class="text-xs font-semibold text-purple-600 uppercase tracking-widest mb-3" x-text="lang==='th' ? 'สำหรับทุกคนในมหาวิทยาลัย' : 'For Everyone at University'"></p>
            <h2 class="text-3xl font-bold text-gray-900">
                <span x-show="lang==='th'">หนึ่งแพลตฟอร์ม ทุกบทบาท</span>
                <span x-show="lang!=='th'">One Platform, Every Role</span>
            </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            @foreach([
                ['gradient'=>'from-brand-500 to-brand-700', 'emoji'=>'🎓', 'th_title'=>'นักศึกษา', 'en_title'=>'Student',
                 'features_th'=>['โฟกัสอัจฉริยะ','บันทึกสะท้อนคิด','AI Coach','ติดตามการเติบโต'],
                 'features_en'=>['Smart Focus','Reflection Journal','AI Coach','Growth Tracking']],
                ['gradient'=>'from-calm-500 to-calm-700', 'emoji'=>'👩‍🏫', 'th_title'=>'อาจารย์', 'en_title'=>'Teacher',
                 'features_th'=>['ติดตามนักศึกษา','วิเคราะห์ชั้นเรียน','ส่งกำลังใจ','รายงานผล'],
                 'features_en'=>['Monitor Students','Class Analytics','Send Support','View Reports']],
                ['gradient'=>'from-purple-500 to-purple-700', 'emoji'=>'💜', 'th_title'=>'นักจิตวิทยา', 'en_title'=>'Psychologist',
                 'features_th'=>['แนวโน้มสุขภาวะ','ตรวจจับความเสี่ยง','ความเป็นส่วนตัว','แทรกแซงเชิงรุก'],
                 'features_en'=>['Wellbeing Trends','Risk Detection','Privacy Control','Proactive Support']],
                ['gradient'=>'from-gray-600 to-gray-800', 'emoji'=>'⚙️', 'th_title'=>'ผู้ดูแลระบบ', 'en_title'=>'Admin',
                 'features_th'=>['จัดการผู้ใช้','วิเคราะห์แพลตฟอร์ม','ตั้งค่าระบบ','ดูแลความปลอดภัย'],
                 'features_en'=>['User Management','Platform Analytics','System Config','Security Audit']],
            ] as $role)
            <div class="rounded-2xl overflow-hidden shadow-card border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                <div class="bg-gradient-to-br {{ $role['gradient'] }} p-5 text-white">
                    <div class="text-3xl mb-2">{{ $role['emoji'] }}</div>
                    <h3 class="font-bold text-lg">
                        <span x-show="lang==='th'">{{ $role['th_title'] }}</span>
                        <span x-show="lang!=='th'">{{ $role['en_title'] }}</span>
                    </h3>
                </div>
                <div class="bg-white p-4">
                    <ul class="space-y-2">
                        @foreach($role['features_th'] as $i => $featureTh)
                        <li class="flex items-center gap-2 text-sm text-gray-700">
                            <svg class="h-3.5 w-3.5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            <span x-show="lang==='th'">{{ $featureTh }}</span>
                            <span x-show="lang!=='th'">{{ $role['features_en'][$i] }}</span>
                        </li>
                        @endforeach
                    </ul>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>


{{-- ═══════════════════════════════════════════
     FOOTER
═══════════════════════════════════════════ --}}
<footer class="bg-gray-50 border-t border-gray-100 py-10 px-4">
    <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-3">
                <div class="h-8 w-8 rounded-xl bg-brand-600 flex items-center justify-center">
                    <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    </svg>
                </div>
                <div>
                    <p class="font-bold text-gray-900 text-sm">KKU GrowthOS</p>
                    <p class="text-xs text-gray-400" x-text="lang==='th' ? 'มหาวิทยาลัยขอนแก่น' : 'Khon Kaen University'"></p>
                </div>
            </div>

            <div class="text-center text-sm text-gray-400">
                <p>
                    © {{ now()->year }} KKU GrowthOS ·
                    <span x-show="lang==='th'">ออกแบบด้วยความห่วงใยเพื่อนักศึกษา ❤️</span>
                    <span x-show="lang!=='th'">Designed with care for students ❤️</span>
                </p>
            </div>

            <div class="flex items-center gap-4 text-sm text-gray-400">
                <a href="{{ route('login') }}" class="hover:text-brand-600 transition-colors" x-text="lang==='th' ? 'เข้าสู่ระบบ' : 'Login'"></a>
                <button @click="toggleLang()" class="hover:text-brand-600 transition-colors" x-text="lang==='th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'"></button>
            </div>
        </div>
    </div>
</footer>

<script>
function landing() {
    return {
        lang: localStorage.getItem('lang') || 'th',
        init() {
            document.documentElement.lang = this.lang;
        },
        toggleLang() {
            this.lang = this.lang === 'th' ? 'en' : 'th';
            localStorage.setItem('lang', this.lang);
            document.documentElement.lang = this.lang;
        },
    };
}
</script>
</body>
</html>
