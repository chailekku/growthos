<x-guest-layout>
<x-slot:title>เข้าสู่ระบบ</x-slot:title>

<div class="min-h-screen flex" x-data="loginPage()">

    {{-- ── Left Panel (desktop only) ──────────────────────── --}}
    <div class="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-purple-700 p-12 text-white relative overflow-hidden">
        {{-- Background circles --}}
        <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div class="absolute rounded-full bg-white" style="width:100px;height:100px;top:10%;left:5%;"></div>
            <div class="absolute rounded-full bg-white" style="width:140px;height:140px;top:25%;left:17%;"></div>
            <div class="absolute rounded-full bg-white" style="width:80px;height:80px;top:50%;left:60%;"></div>
            <div class="absolute rounded-full bg-white" style="width:200px;height:200px;top:65%;left:30%;"></div>
            <div class="absolute rounded-full bg-white" style="width:120px;height:120px;top:5%;left:70%;"></div>
        </div>

        <div class="relative z-10 flex flex-col h-full">
            {{-- Logo --}}
            <div class="flex items-center gap-3 mb-12">
                <div class="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
                    <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                        <path d="M5 3v4M19 17v4M3 5h4M17 19h4"/>
                    </svg>
                </div>
                <div>
					<a href="{{ route('home') }}">
		                <p class="font-bold text-lg">KKU GrowthOS</p>
	                    <p class="text-white/70 text-sm">Personal Growth Infrastructure</p>
					</a>
                </div>
            </div>

            {{-- Headline --}}
            <h2 class="text-4xl font-bold mb-4 leading-tight">
                <span x-show="lang === 'th'">เติบโตอย่างมีความหมาย<br>ในทุกวัน</span>
                <span x-show="lang !== 'th'">Grow meaningfully,<br>every single day</span>
            </h2>
            <p class="text-white/70 text-lg leading-relaxed mb-8">
                <span x-show="lang === 'th'">ระบบ AI ที่ช่วยให้คุณโฟกัส สะท้อนคิด และเติบโตในแบบของคุณเอง</span>
                <span x-show="lang !== 'th'">An AI companion that helps you focus, reflect, and grow your way</span>
            </p>

            {{-- Feature list --}}
            <div class="space-y-3 mt-auto">
                @foreach(['🎯 AI Focus System', '📝 Reflection Journal', '📈 Growth Analytics', '🤝 Wellbeing Support'] as $feature)
                    <div class="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                        <span class="text-sm font-medium">{{ $feature }}</span>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    {{-- ── Right Panel ──────────────────────────────────────── --}}
    <div class="flex-1 flex flex-col items-center justify-center p-8">
        <div class="w-full max-w-sm">

            {{-- Top bar (mobile logo + lang switcher) --}}
            <div class="flex items-center justify-between mb-8">
                <div class="lg:hidden flex items-center gap-2">
                    <svg class="h-5 w-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    </svg>
                    <span class="font-bold text-gray-900">GrowthOS</span>
                </div>
                <button @click="toggleLang()"
                        class="text-xs px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium transition-colors ml-auto">
                    <span x-text="lang === 'th' ? '🌐 English' : '🌐 ภาษาไทย'"></span>
                </button>
            </div>

            {{-- Welcome text --}}
            <div class="mb-6 animate-slide-up">
                <h1 class="text-2xl font-bold text-gray-900 mb-1">
                    <span x-show="lang === 'th'">ยินดีต้อนรับกลับ 👋</span>
                    <span x-show="lang !== 'th'">Welcome back 👋</span>
                </h1>
                <p class="text-gray-500 text-sm">
                    <span x-show="lang === 'th'">เข้าสู่ระบบเพื่อเริ่มต้นวันใหม่</span>
                    <span x-show="lang !== 'th'">Sign in to start your day</span>
                </p>
            </div>

            {{-- KKU SSO --}}
            <div class="space-y-3 mb-5 animate-slide-up">
                <a href="{{ route('auth.kku') }}"
                   class="flex items-center justify-center gap-3 w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors shadow-sm hover:shadow-md text-sm">
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                    </svg>
                    <span x-text="lang === 'th' ? 'เข้าสู่ระบบด้วย KKU Single Sign On' : 'Login with KKU Single Sign On'"></span>
                </a>

                <a href="{{ route('auth.google') }}"
                   class="flex items-center justify-center gap-3 w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 transition-colors text-sm">
                    <svg class="h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span x-text="lang === 'th' ? 'เข้าสู่ระบบด้วย Google (อาจารย์ภายนอก)' : 'Login with Google (External Staff)'"></span>
                </a>
            </div>

            {{-- Demo Mode --}}
            @if(config('app.demo_mode'))
            <div class="animate-slide-up">
                {{-- Divider --}}
                <div class="relative mb-5">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-200"></div>
                    </div>
                    <div class="relative flex justify-center text-xs">
                        <span class="bg-white px-3 text-gray-400 font-medium">
                            <span x-show="lang === 'th'">หรือทดลองใช้งาน Demo</span>
                            <span x-show="lang !== 'th'">Or try demo mode</span>
                        </span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2.5">
                    @foreach([
                        ['role' => 'student',      'th' => 'นักศึกษา',   'en' => 'Student',       'gradient' => 'from-brand-500 to-brand-600',  'icon' => 'graduation'],
                        ['role' => 'teacher',      'th' => 'อาจารย์',    'en' => 'Teacher',       'gradient' => 'from-calm-500 to-calm-600',    'icon' => 'book'],
                        ['role' => 'psychologist', 'th' => 'นักจิตวิทยา','en' => 'Psychologist',  'gradient' => 'from-purple-500 to-purple-600','icon' => 'heart'],
                        ['role' => 'super_admin',  'th' => 'แอดมิน',     'en' => 'Admin',         'gradient' => 'from-gray-600 to-gray-700',    'icon' => 'shield'],
                    ] as $demo)
                    <form method="POST" action="{{ route('demo.login') }}">
                        @csrf
                        <input type="hidden" name="role" value="{{ $demo['role'] }}">
                        <button type="submit"
                                class="w-full flex items-center gap-2.5 p-3 rounded-xl bg-gradient-to-r {{ $demo['gradient'] }} text-white text-sm font-medium shadow-sm hover:shadow-md transition-shadow hover:opacity-90">
                            @if($demo['icon'] === 'graduation')
                                <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                            @elseif($demo['icon'] === 'book')
                                <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                            @elseif($demo['icon'] === 'heart')
                                <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                            @else
                                <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            @endif
                            <span x-text="lang === 'th' ? '{{ $demo['th'] }}' : '{{ $demo['en'] }}'"></span>
                        </button>
                    </form>
                    @endforeach
                </div>

                <p class="text-xs text-gray-400 text-center mt-4">
                    <span x-show="lang === 'th'">โหมดสาธิต · ไม่ต้องใช้บัญชีจริง · ข้อมูลทั้งหมดเป็น Mock Data</span>
                    <span x-show="lang !== 'th'">Demo mode · No account needed · All data is simulated</span>
                </p>
            </div>
            @endif

        </div>
    </div>
</div>

<script>
function loginPage() {
    return {
        lang: localStorage.getItem('lang') || 'th',
        toggleLang() {
            this.lang = this.lang === 'th' ? 'en' : 'th';
            localStorage.setItem('lang', this.lang);
        },
    };
}
</script>
</x-guest-layout>
