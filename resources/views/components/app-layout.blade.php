{{-- This component wraps the full authenticated layout (sidebar + header + main). --}}
{{-- Resolves as <x-app-layout> in all student/teacher/admin views.              --}}
@php
    $role = auth()->user()->role ?? 'student';
    $initials = strtoupper(substr(auth()->user()->name ?? 'US', 0, 2));
    $roleLabel = match($role) {
        'teacher'      => 'Teacher',
        'psychologist' => 'Psychologist',
        'super_admin'  => 'Super Admin',
        default        => 'Student',
    };
@endphp

<!DOCTYPE html>
<html lang="en" x-data="appLayout()" x-init="init()">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? 'GrowthOS' }} — Khon Kaen University</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-50 antialiased">

<div class="flex min-h-screen bg-gray-50" x-data="{ sidebarOpen: true }">

    {{-- ── Sidebar ───────────────────────────────────────────── --}}
    <aside
        class="hidden md:flex flex-col min-h-screen flex-shrink-0 transition-all duration-300"
        :class="sidebarOpen ? 'w-64' : 'w-16'"
        style="background-color: #f0faf0; border-right: 1px solid #d1f0d8;">

        {{-- Logo --}}
        <div class="flex items-center gap-3 px-4 py-5" style="border-bottom: 1px solid #d1f0d8;">
            <div class="h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0" style="background-color:#2D9375;">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    <path d="M5 3v4M19 17v4M3 5h4M17 19h4"/>
                </svg>
            </div>
            <div x-show="sidebarOpen" x-transition>
                <p class="font-bold text-sm leading-none" style="color:#1a5c45;">GrowthOS</p>
                <p class="text-xs" style="color:#4a8c6f;">KKU · ขอนแก่น</p>
            </div>
        </div>

        {{-- Navigation --}}
        <nav class="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">

            @if($role === 'student')

                @foreach([
                    ['student.dashboard',       'student.dashboard',    'Dashboard',        '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>'],
                    ['student.tasks.index',     'student.tasks.*',      'Tasks &amp; Planner', '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'],
                    ['student.courses.index',   'student.courses.*',    'Courses',          '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'],
                    ['student.focus.index',     'student.focus.*',      'Focus Mode',       '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'],
                    ['student.reflection.index','student.reflection.*', 'Reflection',       '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>'],
                    ['student.growth.index',    'student.growth.*',     'Growth',           '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>'],
                    ['student.ai-coach.index',  'student.ai-coach.*',   'AI Coach',         '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>'],
                ] as [$route, $pattern, $label, $icon])
                @php $isActive = request()->routeIs($pattern); @endphp
                <a href="{{ route($route) }}"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                   style="{{ $isActive ? 'background-color:#2D9375; color:white;' : 'color:#2a5a42;' }}"
                   title="{{ $label }}">
                    <span class="shrink-0">{!! $icon !!}</span>
                    <span x-show="sidebarOpen" class="flex-1">{!! $label !!}</span>
                    @if($isActive)<span x-show="sidebarOpen" class="h-1.5 w-1.5 rounded-full bg-white shrink-0"></span>@endif
                </a>
                @endforeach

                <div class="pt-2 pb-1" x-show="sidebarOpen">
                    <div class="border-t" style="border-color:#c3e6cb;"></div>
                </div>

                @php $settingsActive = request()->routeIs('student.settings.*'); @endphp
                <a href="{{ route('student.settings.index') }}"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                   style="{{ $settingsActive ? 'background-color:#2D9375; color:white;' : 'color:#2a5a42;' }}"
                   title="Settings">
                    <span class="shrink-0"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></span>
                    <span x-show="sidebarOpen" class="flex-1">Settings</span>
                    @if($settingsActive)<span x-show="sidebarOpen" class="h-1.5 w-1.5 rounded-full bg-white shrink-0"></span>@endif
                </a>

            @elseif($role === 'teacher')
                <a href="{{ route('teacher.dashboard') }}"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium {{ request()->routeIs('teacher.dashboard') ? 'bg-calm-600 text-white' : 'text-gray-600 hover:bg-gray-50' }}">
                    <span class="shrink-0"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg></span>
                    <span x-show="sidebarOpen">Dashboard</span>
                </a>

            @elseif($role === 'psychologist')
                <a href="{{ route('psychologist.dashboard') }}"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium {{ request()->routeIs('psychologist.dashboard') ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50' }}">
                    <span class="shrink-0"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg></span>
                    <span x-show="sidebarOpen">Dashboard</span>
                </a>

            @elseif($role === 'super_admin')
                <a href="{{ route('admin.dashboard') }}"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium {{ request()->routeIs('admin.dashboard') ? 'bg-gray-700 text-white' : 'text-gray-600 hover:bg-gray-50' }}">
                    <span class="shrink-0"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg></span>
                    <span x-show="sidebarOpen">Dashboard</span>
                </a>
                <a href="{{ route('admin.users') }}"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium {{ request()->routeIs('admin.users') ? 'bg-gray-700 text-white' : 'text-gray-600 hover:bg-gray-50' }}">
                    <span class="shrink-0"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
                    <span x-show="sidebarOpen">Manage Users</span>
                </a>
            @endif
        </nav>

        {{-- User Footer --}}
        <div class="p-3" style="border-top:1px solid #d1f0d8;">
            <div class="flex items-center gap-3 px-2 py-2 rounded-xl mb-2" x-show="sidebarOpen">
                <div class="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 select-none"
                     style="background-color:#2D9375;">{{ $initials }}</div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold truncate" style="color:#1a5c45;">{{ auth()->user()->name }}</p>
                    <span class="inline-block text-xs px-1.5 py-0.5 rounded-full font-medium mt-0.5"
                          style="background-color:#c8f0d6; color:#1a5c45;">{{ $roleLabel }}</span>
                </div>
            </div>
            <div class="flex justify-center mb-2" x-show="!sidebarOpen">
                <div class="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background-color:#2D9375;">{{ $initials }}</div>
            </div>
            <div class="flex items-center gap-1" :class="sidebarOpen ? 'justify-end px-1' : 'justify-center'">
                @if($role === 'student')
                <a href="{{ route('student.settings.index') }}"
                   class="p-2 rounded-lg transition-colors"
                   style="color:#4a8c6f;"
                   title="Settings"
                   onmouseover="this.style.backgroundColor='#d4f0df'"
                   onmouseout="this.style.backgroundColor='transparent'">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                </a>
                @endif
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit"
                            class="p-2 rounded-lg transition-colors"
                            style="color:#4a8c6f;"
                            title="Logout"
                            onmouseover="this.style.backgroundColor='#ffe4e4'; this.style.color='#dc2626';"
                            onmouseout="this.style.backgroundColor='transparent'; this.style.color='#4a8c6f';">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    </button>
                </form>
            </div>
        </div>
    </aside>

    {{-- ── Main Content ──────────────────────────────────────── --}}
    <div class="flex-1 flex flex-col min-w-0">

        {{-- Minimal Header --}}
        <header class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center gap-4">
            <button @click="sidebarOpen = !sidebarOpen"
                    class="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
            </button>

            @isset($title)
                <h1 class="hidden md:block text-base font-semibold text-gray-800">{{ $title }}</h1>
            @endisset

            <div class="flex-1"></div>

            @if(config('app.demo_mode'))
                <span class="hidden sm:inline-flex text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">Demo</span>
            @endif

            <div class="relative" x-data="{ open: false }">
                <button @click="open = !open" class="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                </button>
                <div x-show="open" @click.outside="open = false" x-transition
                     class="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden z-50">
                    <div class="p-4 border-b border-gray-100 flex items-center justify-between">
                        <p class="font-semibold text-gray-900 text-sm">Notifications</p>
                        <button @click="open = false" class="p-1 rounded-lg hover:bg-gray-100">
                            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                        </button>
                    </div>
                    <div class="p-4 text-sm text-gray-500 text-center">No new notifications</div>
                </div>
            </div>

            <div class="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                 style="background-color:#2D9375;">{{ $initials }}</div>
        </header>

        {{-- Main --}}
        <main class="flex-1 p-4 md:p-6 overflow-auto">
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

@livewireScripts

<script>
function appLayout() {
    return {
        lang: localStorage.getItem('lang') || 'en',
        init() { document.documentElement.lang = this.lang; },
        toggleLang() {
            this.lang = this.lang === 'th' ? 'en' : 'th';
            localStorage.setItem('lang', this.lang);
        },
    };
}
</script>
</body>
</html>
