<!DOCTYPE html>
<html lang="th" x-data="{ sidebarOpen: true, lang: localStorage.getItem('lang') || 'th' }">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? 'Gekku GrowthOS' }} — KKU</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="font-sans bg-gray-50 text-gray-900">

<div class="flex h-screen overflow-hidden">
    {{-- Sidebar --}}
    <aside class="w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white flex flex-col flex-shrink-0 shadow-xl"
           :class="{ 'hidden': !sidebarOpen }">
        <div class="px-6 py-5 border-b border-indigo-700">
            <div class="flex items-center space-x-3">
                <div class="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-xl">🌱</div>
                <div>
                    <p class="font-bold text-sm leading-tight">Gekku GrowthOS</p>
                    <p class="text-indigo-300 text-xs">KKU Student Success</p>
                </div>
            </div>
        </div>

        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            @auth
                @php $role = auth()->user()->role; @endphp

                @if($role === 'student')
                    <x-nav-link href="{{ route('student.dashboard') }}" icon="🏠" :active="request()->routeIs('student.dashboard')">
                        <span x-text="lang === 'th' ? 'แดชบอร์ด' : 'Dashboard'"></span>
                    </x-nav-link>
                    <x-nav-link href="{{ route('student.tasks.index') }}" icon="✅" :active="request()->routeIs('student.tasks.*')">
                        <span x-text="lang === 'th' ? 'งานของฉัน' : 'My Tasks'"></span>
                    </x-nav-link>
                    <x-nav-link href="{{ route('student.focus.index') }}" icon="🎯" :active="request()->routeIs('student.focus.*')">
                        <span x-text="lang === 'th' ? 'โฟกัส' : 'Focus'"></span>
                    </x-nav-link>
                    <x-nav-link href="{{ route('student.reflection.index') }}" icon="📓" :active="request()->routeIs('student.reflection.*')">
                        <span x-text="lang === 'th' ? 'บันทึกสะท้อนคิด' : 'Reflection'"></span>
                    </x-nav-link>
                    <x-nav-link href="{{ route('student.ai-coach.index') }}" icon="🤖" :active="request()->routeIs('student.ai-coach.*')">
                        <span x-text="lang === 'th' ? 'AI โค้ช' : 'AI Coach'"></span>
                    </x-nav-link>

                @elseif($role === 'teacher')
                    <x-nav-link href="{{ route('teacher.dashboard') }}" icon="🏫" :active="request()->routeIs('teacher.dashboard')">
                        <span x-text="lang === 'th' ? 'แดชบอร์ด' : 'Dashboard'"></span>
                    </x-nav-link>

                @elseif($role === 'psychologist')
                    <x-nav-link href="{{ route('psychologist.dashboard') }}" icon="💚" :active="request()->routeIs('psychologist.dashboard')">
                        <span x-text="lang === 'th' ? 'แดชบอร์ด' : 'Dashboard'"></span>
                    </x-nav-link>

                @elseif(in_array($role, ['super_admin', 'system_admin']))
                    <x-nav-link href="{{ route('admin.dashboard') }}" icon="⚙️" :active="request()->routeIs('admin.dashboard')">
                        <span x-text="lang === 'th' ? 'แดชบอร์ด' : 'Dashboard'"></span>
                    </x-nav-link>
                    <x-nav-link href="{{ route('admin.users') }}" icon="👥" :active="request()->routeIs('admin.users')">
                        <span x-text="lang === 'th' ? 'จัดการผู้ใช้' : 'Users'"></span>
                    </x-nav-link>
                @endif
            @endauth
        </nav>

        {{-- User info + logout --}}
        @auth
        <div class="px-4 py-4 border-t border-indigo-700">
            <div class="flex items-center space-x-3 mb-3">
                <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                    {{ strtoupper(substr(auth()->user()->name, 0, 1)) }}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate">{{ auth()->user()->name }}</p>
                    <p class="text-indigo-300 text-xs truncate">{{ auth()->user()->email }}</p>
                </div>
            </div>
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="w-full text-left text-indigo-300 hover:text-white text-xs px-2 py-1 rounded hover:bg-indigo-700 transition-colors">
                    <span x-text="lang === 'th' ? '🚪 ออกจากระบบ' : '🚪 Logout'"></span>
                </button>
            </form>
        </div>
        @endauth
    </aside>

    {{-- Main content --}}
    <div class="flex-1 flex flex-col overflow-hidden">
        {{-- Top bar --}}
        <header class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <button @click="sidebarOpen = !sidebarOpen" class="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            </button>
            <div class="flex items-center space-x-4">
                {{-- Language toggle --}}
                <button @click="lang = lang === 'th' ? 'en' : 'th'; localStorage.setItem('lang', lang)"
                        class="text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-50 text-gray-600">
                    <span x-text="lang === 'th' ? 'EN' : 'ไทย'"></span>
                </button>
                @if(config('app.demo_mode'))
                    <span class="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">Demo Mode</span>
                @endif
            </div>
        </header>

        <main class="flex-1 overflow-y-auto p-6">
            @if(session('success'))
                <div class="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
                    {{ session('success') }}
                </div>
            @endif
            @if(session('error'))
                <div class="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                    {{ session('error') }}
                </div>
            @endif
            {{ $slot }}
        </main>
    </div>
</div>

@livewireScripts
</body>
</html>
