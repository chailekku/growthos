<x-guest-layout>
    <x-slot:title>เข้าสู่ระบบ</x-slot:title>

    <div class="min-h-screen flex items-center justify-center py-12 px-4"
         x-data="{ lang: localStorage.getItem('lang') || 'th' }">
        <div class="w-full max-w-md">
            {{-- Logo --}}
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg mb-4">
                    <span class="text-3xl">🌱</span>
                </div>
                <h1 class="text-2xl font-bold text-gray-900">Gekku GrowthOS</h1>
                <p class="text-gray-500 text-sm mt-1">
                    <span x-text="lang === 'th' ? 'ระบบพัฒนาศักยภาพนักศึกษา มหาวิทยาลัยขอนแก่น' : 'Student Success Platform — Khon Kaen University'"></span>
                </p>
            </div>

            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {{-- KKU SSO Section --}}
                <div class="p-8">
                    <h2 class="font-semibold text-gray-800 mb-1">
                        <span x-text="lang === 'th' ? 'เข้าสู่ระบบด้วย KKU SSO' : 'Login with KKU SSO'"></span>
                    </h2>
                    <p class="text-sm text-gray-500 mb-5">
                        <span x-text="lang === 'th' ? 'สำหรับนักศึกษา (@kkumail.com) และบุคลากร (@kku.ac.th)' : 'For students (@kkumail.com) and staff (@kku.ac.th)'"></span>
                    </p>
                    <a href="{{ route('auth.microsoft') }}"
                       class="flex items-center justify-center space-x-3 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm">
                        <svg class="w-5 h-5" viewBox="0 0 21 21" fill="currentColor">
                            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                        </svg>
                        <span x-text="lang === 'th' ? 'เข้าสู่ระบบด้วย Microsoft (KKU SSO)' : 'Login with Microsoft (KKU SSO)'"></span>
                    </a>
                </div>

                <div class="border-t border-gray-100 px-8 py-6">
                    <h2 class="font-semibold text-gray-800 mb-1 text-sm">
                        <span x-text="lang === 'th' ? 'อาจารย์ภายนอก' : 'External Faculty'"></span>
                    </h2>
                    <p class="text-xs text-gray-500 mb-4">
                        <span x-text="lang === 'th' ? 'สำหรับอาจารย์ที่ไม่มีอีเมล @kku.ac.th' : 'For teachers without @kku.ac.th email'"></span>
                    </p>
                    <a href="{{ route('auth.google') }}"
                       class="flex items-center justify-center space-x-3 w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors border border-gray-300 text-sm">
                        <svg class="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span x-text="lang === 'th' ? 'เข้าสู่ระบบด้วย Google' : 'Login with Google'"></span>
                    </a>
                </div>

                @if(config('app.demo_mode'))
                <div class="border-t border-gray-100 bg-amber-50 px-8 py-6">
                    <p class="text-sm font-semibold text-amber-800 mb-3">
                        🎯 <span x-text="lang === 'th' ? 'Demo Mode — เลือกบทบาท' : 'Demo Mode — Select Role'"></span>
                    </p>
                    <div class="grid grid-cols-2 gap-2">
                        @foreach([
                            ['role' => 'student', 'label_th' => 'นักศึกษา', 'label_en' => 'Student', 'icon' => '🎓'],
                            ['role' => 'teacher', 'label_th' => 'อาจารย์', 'label_en' => 'Teacher', 'icon' => '📚'],
                            ['role' => 'psychologist', 'label_th' => 'นักจิตวิทยา', 'label_en' => 'Psychologist', 'icon' => '💚'],
                            ['role' => 'super_admin', 'label_th' => 'แอดมิน', 'label_en' => 'Admin', 'icon' => '⚙️'],
                        ] as $demo)
                        <form method="POST" action="{{ route('demo.login') }}">
                            @csrf
                            <input type="hidden" name="role" value="{{ $demo['role'] }}">
                            <button type="submit"
                                    class="w-full py-2 px-3 text-xs font-medium bg-white border border-amber-200 text-amber-800 rounded-lg hover:bg-amber-100 transition-colors text-left">
                                {{ $demo['icon'] }}
                                <span x-text="lang === 'th' ? '{{ $demo['label_th'] }}' : '{{ $demo['label_en'] }}'"></span>
                            </button>
                        </form>
                        @endforeach
                    </div>
                </div>
                @endif
            </div>

            <div class="text-center mt-6">
                <button @click="lang = lang === 'th' ? 'en' : 'th'; localStorage.setItem('lang', lang)"
                        class="text-sm text-gray-500 hover:text-gray-700">
                    <span x-text="lang === 'th' ? '🌐 Switch to English' : '🌐 เปลี่ยนเป็นภาษาไทย'"></span>
                </button>
            </div>
        </div>
    </div>
</x-guest-layout>
