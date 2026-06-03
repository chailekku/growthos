<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? 'GrowthOS' }} — มหาวิทยาลัยขอนแก่น</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-50 antialiased">

@auth
@php
    $role     = auth()->user()->role;
    $initials = strtoupper(substr(auth()->user()->name, 0, 2));
    $roleLabel = match($role) {
        'teacher'      => 'อาจารย์ / ที่ปรึกษา',
        'psychologist' => 'นักจิตวิทยา',
        'super_admin'  => 'ผู้ดูแลระบบ',
        default        => 'นักศึกษา',
    };
    $roleBadgeStyle = match($role) {
        'teacher'      => 'background-color:#d1fae5; color:#065f46;',
        'psychologist' => 'background-color:#ede9fe; color:#5b21b6;',
        'super_admin'  => 'background-color:#fee2e2; color:#991b1b;',
        default        => 'background-color:#c8f0d6; color:#1a5c45;',
    };
    $roleIcon = match($role) {
        'teacher'      => '📚',
        'psychologist' => '💜',
        'super_admin'  => '🛡️',
        default        => '🎓',
    };
@endphp

{{-- ── ICON helper macro ──────────────────────────────────────── --}}
@php
function navIcon(string $name): string {
    return match($name) {
        'dashboard'   => '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
        'tasks'       => '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
        'courses'     => '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
        'focus'       => '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        'reflection'  => '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
        'growth'      => '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
        'ai-coach'    => '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
        'settings'    => '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
        'users'       => '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
        'analytics'   => '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
        'heart'       => '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
        'activity'    => '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
        'star'        => '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
        'file'        => '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
        'health'      => '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
        default       => '<circle cx="12" cy="12" r="5"/>',
    };
}
@endphp

<div class="flex min-h-screen bg-gray-50" style="scrollbar-gutter: stable;">

    {{-- ══════════════════════════════════════════════════════════
         SIDEBAR — Fixed width 240px, no collapse
    ══════════════════════════════════════════════════════════════ --}}
    <aside class="hidden md:flex flex-col w-60 min-h-screen flex-shrink-0"
           style="background-color:#f0faf0; border-right:1px solid #d1f0d8;">

        {{-- Logo --}}
        <div class="flex items-center gap-3 px-5 py-5" style="border-bottom:1px solid #d1f0d8;">
            <div class="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style="background-color:#2D9375;">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    <path d="M5 3v4M19 17v4M3 5h4M17 19h4"/>
                </svg>
            </div>
            <div>
                <p class="font-bold text-sm leading-none" style="color:#1a5c45;">GrowthOS</p>
                <p class="text-xs" style="color:#4a8c6f;">KKU · ขอนแก่น</p>
            </div>
        </div>

        {{-- Navigation --}}
        <nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">

@php
/* ── helper: render a single nav link ── */
function navLink(string $href, string $label, string $iconName, bool $active): string {
    $activeStyle = 'background-color:#2D9375; color:white;';
    $inactiveStyle = 'color:#2a5a42;';
    $dot = $active ? '<span class="h-1.5 w-1.5 rounded-full bg-white shrink-0 ml-auto"></span>' : '';
    $icon = navIcon($iconName);
    $style = $active ? $activeStyle : $inactiveStyle;
    $hover = $active ? '' : 'hover:bg-white/60';
    return <<<HTML
<a href="{$href}"
   class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 {$hover}"
   style="{$style}">
    <span class="shrink-0"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">{$icon}</svg></span>
    <span class="flex-1">{$label}</span>
    {$dot}
</a>
HTML;
}
@endphp

            @if($role === 'student')
                {!! navLink(route('student.dashboard'),         'แดชบอร์ด',           'dashboard',  request()->routeIs('student.dashboard')) !!}
                {!! navLink(route('student.tasks.index'),       'งานและแผนการ',        'tasks',      request()->routeIs('student.tasks.*')) !!}
                {!! navLink(route('student.courses.index'),     'รายวิชา',             'courses',    request()->routeIs('student.courses.*')) !!}
                {!! navLink(route('student.focus.index'),       'โหมดโฟกัส',           'focus',      request()->routeIs('student.focus.*')) !!}
                {!! navLink(route('student.reflection.index'),  'บันทึกสะท้อนคิด',     'reflection', request()->routeIs('student.reflection.*')) !!}
                {!! navLink(route('student.growth.index'),      'การเติบโต',           'growth',     request()->routeIs('student.growth.*')) !!}
                {!! navLink(route('student.ai-coach.index'),    'AI โค้ช',             'ai-coach',   request()->routeIs('student.ai-coach.*')) !!}
                <div class="pt-2 pb-1"><div class="border-t" style="border-color:#c3e6cb;"></div></div>
                {!! navLink(route('student.settings.index'),    'ตั้งค่า',             'settings',   request()->routeIs('student.settings.*')) !!}

            @elseif($role === 'teacher')
                {!! navLink(route('teacher.dashboard'),                   'แดชบอร์ดอาจารย์',    'dashboard',  request()->routeIs('teacher.dashboard')) !!}
                {!! navLink(route('teacher.student-analytics.index'),     'วิเคราะห์นักศึกษา',  'users',      request()->routeIs('teacher.student-analytics.*')) !!}
                {!! navLink(route('teacher.course-analytics.index'),      'วิเคราะห์รายวิชา',   'analytics',  request()->routeIs('teacher.course-analytics.*')) !!}
                <div class="pt-2 pb-1"><div class="border-t" style="border-color:#c3e6cb;"></div></div>
                {!! navLink(route('teacher.settings.index'),              'ตั้งค่า',             'settings',   request()->routeIs('teacher.settings.*')) !!}

            @elseif($role === 'psychologist')
                {!! navLink(route('psychologist.dashboard'),                       'แดชบอร์ดสุขภาวะ',      'heart',    request()->routeIs('psychologist.dashboard')) !!}
                {!! navLink(route('psychologist.emotional-trends.index'),          'แนวโน้มอารมณ์',        'activity', request()->routeIs('psychologist.emotional-trends.*')) !!}
                {!! navLink(route('psychologist.support-recommendations.index'),   'คำแนะนำการดูแล',       'star',     request()->routeIs('psychologist.support-recommendations.*')) !!}
                <div class="pt-2 pb-1"><div class="border-t" style="border-color:#c3e6cb;"></div></div>
                {!! navLink(route('psychologist.settings.index'),                  'ตั้งค่า',               'settings', request()->routeIs('psychologist.settings.*')) !!}

            @elseif($role === 'super_admin')
                {!! navLink(route('admin.dashboard'),                   'แดชบอร์ดแอดมิน',      'dashboard',  request()->routeIs('admin.dashboard')) !!}
                {!! navLink(route('admin.course-management.index'),     'จัดการรายวิชา',        'courses',    request()->routeIs('admin.course-management.*')) !!}
                {!! navLink(route('admin.users'),                        'จัดการผู้ใช้',          'users',      request()->routeIs('admin.users')) !!}
                {!! navLink(route('admin.platform-analytics.index'),    'วิเคราะห์แพลตฟอร์ม',   'analytics',  request()->routeIs('admin.platform-analytics.*')) !!}
                {!! navLink(route('admin.system-health.index'),         'สุขภาพระบบ',           'health',     request()->routeIs('admin.system-health.*')) !!}
                {!! navLink(route('admin.audit-logs.index'),            'บันทึกกิจกรรม',         'file',       request()->routeIs('admin.audit-logs.*')) !!}
                <div class="pt-2 pb-1"><div class="border-t" style="border-color:#c3e6cb;"></div></div>
                {!! navLink(route('admin.settings.index'),              'ตั้งค่า',               'settings',   request()->routeIs('admin.settings.*')) !!}
            @endif

        </nav>

        {{-- User Footer --}}
        <div class="p-3" style="border-top:1px solid #d1f0d8;">
            <div class="flex items-center gap-3 px-2 py-2 rounded-xl mb-1">
                <div class="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 select-none"
                     style="background-color:#2D9375;">{{ $initials }}</div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold truncate" style="color:#1a5c45;">{{ auth()->user()->name }}</p>
                    <span class="inline-block text-xs px-1.5 py-0.5 rounded-full font-medium mt-0.5"
                          style="{{ $roleBadgeStyle }}">{{ $roleIcon }} {{ $roleLabel }}</span>
                </div>
            </div>

            {{-- Settings + Logout icons --}}
            <div class="flex items-center justify-end gap-1 px-1">
                @php
                    $settingsRoute = match($role) {
                        'teacher'      => 'teacher.settings.index',
                        'psychologist' => 'psychologist.settings.index',
                        'super_admin'  => 'admin.settings.index',
                        default        => 'student.settings.index',
                    };
                @endphp
                <a href="{{ route($settingsRoute) }}"
                   class="p-2 rounded-lg transition-colors"
                   style="color:#4a8c6f;"
                   title="ตั้งค่า"
                   onmouseover="this.style.backgroundColor='#d4f0df'"
                   onmouseout="this.style.backgroundColor='transparent'">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </a>
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit"
                            class="p-2 rounded-lg transition-colors"
                            style="color:#4a8c6f;"
                            title="ออกจากระบบ"
                            onmouseover="this.style.backgroundColor='#ffe4e4'; this.style.color='#dc2626';"
                            onmouseout="this.style.backgroundColor='transparent'; this.style.color='#4a8c6f';">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" x2="9" y1="12" y2="12"/>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    </aside>

    {{-- ══════════════════════════════════════════════════════════
         MAIN CONTENT
    ══════════════════════════════════════════════════════════════ --}}
    <div class="flex-1 flex flex-col min-w-0">

        {{-- Header --}}
        <header class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-5 h-14 flex items-center gap-4">

            {{-- Mobile logo --}}
            <div class="md:hidden flex items-center gap-2">
                <div class="h-7 w-7 rounded-lg flex items-center justify-center" style="background-color:#2D9375;">
                    <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    </svg>
                </div>
                <span class="font-bold text-sm" style="color:#1a5c45;">GrowthOS</span>
            </div>

            {{-- Page title --}}
            @isset($title)
                <h1 class="hidden md:block text-base font-semibold text-gray-800">{{ $title }}</h1>
            @endisset

            <div class="flex-1"></div>

            {{-- Demo Mode Switcher --}}
            @if(config('app.demo_mode') && str_starts_with(auth()->user()?->email ?? '', 'demo.'))
                <div class="relative" x-data="{ open: false }">
                    <button @click="open = !open"
                            class="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full font-medium"
                            style="background-color:#fef3c7; color:#92400e; border:1px solid #fcd34d;">
                        🎭 Demo
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </button>
                    <div x-show="open" @click.outside="open = false" x-transition
                         class="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                        <form method="POST" action="{{ route('demo.login') }}" class="divide-y divide-gray-100">
                            @csrf
                            <button type="submit" name="role" value="student" class="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm {{ $role === 'student' ? 'font-semibold text-teal-700 bg-teal-50' : 'text-gray-700' }}">
                                🎓 นักศึกษา
                            </button>
                            <button type="submit" name="role" value="teacher" class="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm {{ $role === 'teacher' ? 'font-semibold text-teal-700 bg-teal-50' : 'text-gray-700' }}">
                                📚 อาจารย์
                            </button>
                            <button type="submit" name="role" value="psychologist" class="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm {{ $role === 'psychologist' ? 'font-semibold text-purple-700 bg-purple-50' : 'text-gray-700' }}">
                                💜 นักจิตวิทยา
                            </button>
                            <button type="submit" name="role" value="super_admin" class="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm {{ $role === 'super_admin' ? 'font-semibold text-red-700 bg-red-50' : 'text-gray-700' }}">
                                🛡️ ผู้ดูแลระบบ
                            </button>
                        </form>
                    </div>
                </div>
            @elseif(config('app.demo_mode'))
                <span class="hidden sm:inline-flex text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">Demo</span>
            @endif

            {{-- Bell --}}
            <div class="relative" x-data="{ open: false }">
                <button @click="open = !open" class="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                    </svg>
                </button>
                <div x-show="open" @click.outside="open = false" x-transition
                     class="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div class="p-4 border-b border-gray-100 flex items-center justify-between">
                        <p class="font-semibold text-gray-900 text-sm">การแจ้งเตือน</p>
                        <button @click="open = false" class="p-1 rounded-lg hover:bg-gray-100">
                            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                        </button>
                    </div>
                    <div class="p-4 text-sm text-gray-500 text-center">ไม่มีการแจ้งเตือนใหม่</div>
                </div>
            </div>

            {{-- Avatar --}}
            <div class="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                 style="background-color:#2D9375;">{{ $initials }}</div>
        </header>

        {{-- Main --}}
        <main class="flex-1 p-4 md:p-6 overflow-auto" style="scrollbar-gutter: stable;">
            @if(session('success'))
                <div class="mb-4 flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-100 text-green-800 rounded-xl text-sm">
                    <svg class="h-4 w-4 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    {{ session('success') }}
                </div>
            @endif
            @if(session('error'))
                <div class="mb-4 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-100 text-red-800 rounded-xl text-sm">
                    <svg class="h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                    {{ session('error') }}
                </div>
            @endif
            {{ $slot }}
        </main>
    </div>
</div>

@endauth

@livewireScripts

<script>
// Alpine.js minimal init (notification dropdown etc.)
document.addEventListener('alpine:init', () => {});
</script>
</body>
</html>
