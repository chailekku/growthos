<x-app-layout>
<x-slot:title>My Courses</x-slot:title>

<div x-data="courses()" class="space-y-6 max-w-6xl mx-auto">

    {{-- ── Header ──────────────────────────────────────────────── --}}
    <div class="flex items-start justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">My Courses</h1>
            <p class="text-sm text-gray-400 mt-0.5">Hi, {{ auth()->user()->name }} — Semester 1 / 2026</p>
        </div>
    </div>

    {{-- ── 3 Stat Cards ─────────────────────────────────────────── --}}
    <div class="grid grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style="background-color:#dbeafe;">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <div>
                <p class="text-2xl font-bold text-gray-900">{{ $totalCredits }}</p>
                <p class="text-xs text-gray-500 font-medium">Total Credits</p>
            </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style="background-color:#d1fae5;">
                <svg class="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <div>
                <p class="text-2xl font-bold text-gray-900">{{ $activeCourses }}</p>
                <p class="text-xs text-gray-500 font-medium">Active Courses</p>
            </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style="background-color:#ede9fe;">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
            </div>
            <div>
                <p class="text-2xl font-bold text-gray-900">{{ $completedCourses }}</p>
                <p class="text-xs text-gray-500 font-medium">Completed Courses</p>
            </div>
        </div>
    </div>

    {{-- ── Tab Bar ──────────────────────────────────────────────── --}}
    <div class="flex gap-1 bg-white rounded-2xl border border-gray-100 p-1.5 w-fit" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
        <button @click="activeTab = 'enrolled'"
                :class="activeTab === 'enrolled' ? 'text-white rounded-xl px-5 py-2 text-sm font-semibold' : 'text-gray-600 px-5 py-2 text-sm font-medium hover:bg-gray-50 rounded-xl'"
                :style="activeTab === 'enrolled' ? 'background-color:#2D9375;' : ''">
            Enrolled
        </button>
        <button @click="activeTab = 'browse'"
                :class="activeTab === 'browse' ? 'text-white rounded-xl px-5 py-2 text-sm font-semibold' : 'text-gray-600 px-5 py-2 text-sm font-medium hover:bg-gray-50 rounded-xl'"
                :style="activeTab === 'browse' ? 'background-color:#2D9375;' : ''">
            Browse Courses
        </button>
    </div>

    {{-- ── Search + Filter ──────────────────────────────────────── --}}
    <div class="space-y-3">
        <div class="relative max-w-md">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" x-model="search" placeholder="Search courses..."
                   class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:border-transparent outline-none"
                   style="focus-ring-color:#2D9375;">
        </div>

        {{-- Filter chips --}}
        <div class="flex flex-wrap gap-2">
            @foreach(['All','Required','Elective','General Education','Seminar','Laboratory'] as $filter)
                <button @click="activeFilter = '{{ $filter }}'"
                        :class="activeFilter === '{{ $filter }}'
                            ? 'text-white border-transparent'
                            : 'text-gray-600 bg-white border-gray-200 hover:border-teal-300'"
                        :style="activeFilter === '{{ $filter }}' ? 'background-color:#2D9375; border-color:#2D9375;' : ''"
                        class="px-4 py-1.5 rounded-full text-sm font-medium border transition-all">
                    {{ $filter }}
                </button>
            @endforeach
        </div>
    </div>

    {{-- ── Course Cards ─────────────────────────────────────────── --}}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        @php
            $colorSets = [
                ['bg' => '#eff6ff', 'accent' => '#3b82f6', 'btn' => '#1d4ed8'],
                ['bg' => '#f0fdf4', 'accent' => '#22c55e', 'btn' => '#16a34a'],
                ['bg' => '#faf5ff', 'accent' => '#a855f7', 'btn' => '#7c3aed'],
                ['bg' => '#fff7ed', 'accent' => '#f97316', 'btn' => '#ea580c'],
                ['bg' => '#fdf2f8', 'accent' => '#ec4899', 'btn' => '#db2777'],
                ['bg' => '#f0faf5', 'accent' => '#10b981', 'btn' => '#059669'],
            ];
        @endphp
        @foreach($courses as $idx => $course)
            @php $colors = $colorSets[$idx % count($colorSets)]; @endphp
            <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                 style="box-shadow:0 2px 8px rgba(0,0,0,.06);"
                 x-show="(activeFilter === 'All' || activeFilter === '{{ $course['type'] }}') && ('{{ strtolower($course['name'] . ' ' . $course['code']) }}'.includes(search.toLowerCase()))">

                {{-- Card Header --}}
                <div class="px-5 pt-5 pb-4" style="background-color: {{ $colors['bg'] }};">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-xs font-bold px-2.5 py-1 rounded-full text-white" style="background-color: {{ $colors['accent'] }};">
                            {{ $course['code'] }}
                        </span>
                        <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-white border" style="color: {{ $colors['accent'] }}; border-color: {{ $colors['accent'] }}30;">
                            {{ $course['credits'] }} Credits
                        </span>
                    </div>
                    <h3 class="text-sm font-bold text-gray-900 leading-snug">{{ $course['name'] }}</h3>
                </div>

                {{-- Card Body --}}
                <div class="px-5 py-4 space-y-3">
                    <div class="flex items-center gap-2 text-xs text-gray-500">
                        <svg class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {{ $course['teacher'] }}
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-500">
                        <svg class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {{ $course['schedule'] }}
                    </div>

                    {{-- Progress --}}
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs text-gray-500">Progress</span>
                            <span class="text-xs font-semibold text-gray-700">{{ $course['progress'] }}%</span>
                        </div>
                        <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all" style="width: {{ $course['progress'] }}%; background-color: {{ $colors['accent'] }};"></div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                              style="background-color: {{ $colors['bg'] }}; color: {{ $colors['accent'] }};">
                            {{ $course['type'] }}
                        </span>
                        <a href="{{ route('student.focus.index') }}"
                           class="text-xs font-semibold px-3 py-1.5 rounded-xl text-white hover:opacity-90 transition-opacity"
                           style="background-color: {{ $colors['btn'] }};">
                            Start Focus
                        </a>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>

<script>
function courses() {
    return {
        activeTab: 'enrolled',
        activeFilter: 'All',
        search: '',
    }
}
</script>
</x-app-layout>
