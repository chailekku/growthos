<x-app-layout>
<x-slot:title>Dashboard</x-slot:title>

<div x-data="dashboard()" class="space-y-6 max-w-7xl mx-auto">

    {{-- ── Header ──────────────────────────────────────────────── --}}
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
            <p class="text-sm text-gray-500 font-medium" x-text="greeting"></p>
            <h2 class="text-2xl font-bold text-gray-900 mt-0.5">{{ auth()->user()->name }}</h2>
            <p class="text-sm text-gray-400 mt-0.5">{{ now()->format('l, F j, Y') }}</p>
        </div>
        {{-- AI Insight Quote --}}
        <div class="flex-shrink-0 max-w-sm bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl px-4 py-3">
            <div class="flex items-center gap-2 mb-1">
                <svg class="h-4 w-4 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                <span class="text-xs font-semibold text-teal-700">AI Insight</span>
            </div>
            <p class="text-xs text-gray-600 leading-relaxed" x-text="insights[insightIndex]"></p>
            <button @click="nextInsight()" class="text-xs text-teal-600 mt-1 hover:underline">New insight</button>
        </div>
    </div>

    {{-- ── 4 Stat Cards ─────────────────────────────────────────── --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {{-- Daily Goals --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="flex items-center justify-between mb-3">
                <div class="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>
                </div>
                <span class="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">+12%</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ $tasksCompleted }}<span class="text-base font-normal text-gray-400">/4</span></p>
            <p class="text-xs font-medium text-gray-500 mt-0.5">Daily Goals</p>
            <div class="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-purple-500 transition-all" style="width: {{ $tasksCompleted > 0 ? min(100, ($tasksCompleted/4)*100) : 0 }}%"></div>
            </div>
        </div>

        {{-- Focus Hours --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="flex items-center justify-between mb-3">
                <div class="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <span class="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">+8%</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">
                @php $h = floor($todayFocusMinutes/60); $m = $todayFocusMinutes % 60; @endphp
                {{ $h > 0 ? $h.'h ' : '' }}{{ $m }}m
            </p>
            <p class="text-xs font-medium text-gray-500 mt-0.5">Focus Hours</p>
            <div class="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-blue-500 transition-all" style="width: {{ min(100, ($todayFocusMinutes/120)*100) }}%"></div>
            </div>
        </div>

        {{-- Tasks Completed --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="flex items-center justify-between mb-3">
                <div class="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <svg class="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                </div>
                <span class="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 font-medium">On track</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ $tasksCompleted }}<span class="text-base font-normal text-gray-400">/{{ max($tasksTotal, 6) }}</span></p>
            <p class="text-xs font-medium text-gray-500 mt-0.5">Tasks Completed</p>
            <div class="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-teal-500 transition-all" style="width: {{ $tasksTotal > 0 ? round(($tasksCompleted/$tasksTotal)*100) : 0 }}%"></div>
            </div>
        </div>

        {{-- Reflection --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="flex items-center justify-between mb-3">
                <div class="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <svg class="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                </div>
                @if($recentReflection)
                    <span class="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">Done</span>
                @else
                    <span class="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">Pending</span>
                @endif
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ $recentReflection ? '1' : '0' }}<span class="text-base font-normal text-gray-400">/1</span></p>
            <p class="text-xs font-medium text-gray-500 mt-0.5">Reflection</p>
            <div class="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-amber-400 transition-all" style="width: {{ $recentReflection ? 100 : 0 }}%"></div>
            </div>
        </div>
    </div>

    {{-- ── Two-column layout ────────────────────────────────────── --}}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {{-- Left 2/3 --}}
        <div class="lg:col-span-2 space-y-6">

            {{-- Weekly Progress Chart --}}
            <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <p class="text-sm font-semibold text-gray-900">Weekly Progress</p>
                        <p class="text-xs text-gray-400 mt-0.5">Focus minutes per day</p>
                    </div>
                    <span class="text-sm font-bold px-3 py-1 rounded-full text-white" style="background-color:#2D9375;">72%</span>
                </div>
                <canvas id="weeklyProgressChart" height="100"></canvas>
            </div>

            {{-- Recent Activity --}}
            <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
                <div class="flex items-center justify-between mb-4">
                    <p class="text-sm font-semibold text-gray-900">Recent Activity</p>
                    <a href="{{ route('student.tasks.index') }}" class="text-xs font-medium" style="color:#2D9375;">View all</a>
                </div>
                <div class="space-y-2">
                    @forelse($recentTasks as $task)
                        <div class="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:border-gray-100 transition-colors"
                             style="border-left: 3px solid {{ match($task->priority) { 'urgent'=>'#ef4444','high'=>'#f97316','medium'=>'#3b82f6',default=>'#d1d5db' } }}">
                            <span class="w-2 h-2 rounded-full shrink-0 {{ match($task->priority) { 'urgent'=>'bg-red-500','high'=>'bg-orange-500','medium'=>'bg-blue-500',default=>'bg-gray-300' } }}"></span>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate">{{ $task->title }}</p>
                                @if($task->due_date)
                                    <p class="text-xs text-gray-400">Due {{ $task->due_date->format('M j') }}</p>
                                @endif
                            </div>
                            <span class="text-xs px-2 py-0.5 rounded-full font-medium {{ match($task->priority) { 'urgent'=>'bg-red-100 text-red-700','high'=>'bg-orange-100 text-orange-700','medium'=>'bg-blue-100 text-blue-700',default=>'bg-gray-100 text-gray-600' } }}">
                                {{ ucfirst($task->priority) }}
                            </span>
                        </div>
                    @empty
                        <p class="text-gray-400 text-sm text-center py-6">No pending tasks — great work!</p>
                    @endforelse
                </div>
            </div>

            {{-- Quick Actions --}}
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <a href="{{ route('student.focus.index') }}"
                   class="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl text-white text-center text-sm font-medium hover:opacity-90 transition-opacity"
                   style="background-color:#2D9375;">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="10 8 16 12 10 16 10 8"/></svg>
                    Start Focus Session
                </a>
                <a href="{{ route('student.tasks.index') }}"
                   class="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl text-white text-center text-sm font-medium hover:opacity-90 transition-opacity"
                   style="background-color:#4f46e5;">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                    Add Task
                </a>
                <a href="{{ route('student.reflection.index') }}"
                   class="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl text-white text-center text-sm font-medium hover:opacity-90 transition-opacity"
                   style="background-color:#7c3aed;">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    Write Reflection
                </a>
                <a href="{{ route('student.reflection.index') }}"
                   class="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl text-white text-center text-sm font-medium hover:opacity-90 transition-opacity"
                   style="background-color:#d97706;">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    Check-in Mood
                </a>
            </div>
        </div>

        {{-- Right 1/3 --}}
        <div class="space-y-5">

            {{-- Mood Tracker --}}
            <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
                <p class="text-sm font-semibold text-gray-900 mb-3">Mood Tracker</p>
                @if($todayMood)
                    <div class="text-center py-2">
                        <div class="text-5xl mb-2">{{ ['😔','😕','😐','🙂','😄'][$todayMood->mood - 1] }}</div>
                        <p class="text-sm text-gray-500">Energy: {{ $todayMood->energy }}/5</p>
                        <p class="text-xs text-gray-400 mt-1">Logged today</p>
                    </div>
                @else
                    <p class="text-xs text-gray-500 mb-3">How are you feeling right now?</p>
                    <div class="flex justify-between gap-1">
                        @foreach([['😔','Struggling'],['😕','Low'],['😐','Okay'],['🙂','Good'],['😄','Great']] as [$emoji, $label])
                            <button @click="selectedMood = '{{ $label }}'"
                                    :class="selectedMood === '{{ $label }}' ? 'ring-2 ring-offset-1 bg-teal-50' : 'hover:bg-gray-50'"
                                    class="flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all flex-1"
                                    style="ring-color:#2D9375">
                                <span class="text-xl">{{ $emoji }}</span>
                                <span class="text-xs text-gray-500">{{ $label }}</span>
                            </button>
                        @endforeach
                    </div>
                    <a href="{{ route('student.reflection.index') }}"
                       class="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
                       style="background-color:#2D9375;">
                        Log Mood
                    </a>
                @endif
            </div>

            {{-- AI Insights --}}
            <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
                <p class="text-sm font-semibold text-gray-900 mb-3">AI Insights</p>
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">Productivity</span>
                        <span class="text-sm font-bold text-gray-900">78%</span>
                    </div>
                    <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full rounded-full" style="width:78%; background-color:#2D9375;"></div>
                    </div>
                    <div class="flex items-center justify-between mt-2">
                        <span class="text-xs text-gray-500">Wellbeing</span>
                        <span class="text-sm font-bold text-gray-900">65%</span>
                    </div>
                    <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full rounded-full bg-purple-500" style="width:65%;"></div>
                    </div>
                </div>
            </div>

            {{-- Habits --}}
            <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
                <div class="flex items-center justify-between mb-3">
                    <p class="text-sm font-semibold text-gray-900">Habits</p>
                    <a href="{{ route('student.growth.index') }}" class="text-xs font-medium" style="color:#2D9375;">View growth</a>
                </div>
                <div class="space-y-3">
                    @foreach([['Morning Journaling', 5, true], ['Pomodoro Sessions', 7, true], ['Daily Reading', 3, true], ['Exercise / Walk', 1, false]] as [$habit, $streak, $done])
                        <div class="flex items-center gap-3">
                            <div class="h-5 w-5 rounded-full flex items-center justify-center shrink-0 {{ $done ? 'bg-teal-100' : 'border-2 border-gray-200' }}">
                                @if($done)
                                    <svg class="h-3 w-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                                @endif
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs font-medium text-gray-700 truncate">{{ $habit }}</p>
                            </div>
                            <span class="text-xs font-bold" style="color:#2D9375;">{{ $streak }}d</span>
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- Notifications --}}
            <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
                <p class="text-sm font-semibold text-gray-900 mb-3">Notifications</p>
                <div class="space-y-3">
                    <div class="flex items-start gap-3">
                        <div class="h-7 w-7 rounded-full bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                            <svg class="h-3.5 w-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </div>
                        <div class="flex-1">
                            <p class="text-xs font-medium text-gray-700">Focus session reminder</p>
                            <p class="text-xs text-gray-400">Start your daily focus now</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <div class="h-7 w-7 rounded-full bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
                            <svg class="h-3.5 w-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                        </div>
                        <div class="flex-1">
                            <p class="text-xs font-medium text-gray-700">Daily reflection due</p>
                            <p class="text-xs text-gray-400">Write today's reflection entry</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <div class="h-7 w-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                            <svg class="h-3.5 w-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                        </div>
                        <div class="flex-1">
                            <p class="text-xs font-medium text-gray-700">New AI Insight ready</p>
                            <p class="text-xs text-gray-400">Based on your activity this week</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function dashboard() {
    return {
        selectedMood: '',
        insightIndex: 0,
        insights: [
            'Your productivity peaks mid-morning. Try scheduling deep work between 9–11am.',
            'Consistency is the root of sustainable growth. Every day you show up counts.',
            'Your reflection patterns show developing Growth Mindset — keep it up!',
            'Quality rest improves memory consolidation. Protect your sleep.',
        ],
        get greeting() {
            const h = new Date().getHours();
            if (h < 12) return 'Good morning,';
            if (h < 17) return 'Good afternoon,';
            return 'Good evening,';
        },
        nextInsight() {
            this.insightIndex = (this.insightIndex + 1) % this.insights.length;
        },
        init() {
            this.$nextTick(() => this.renderChart());
        },
        renderChart() {
            const ctx = document.getElementById('weeklyProgressChart');
            if (!ctx || !window.Chart) return;
            const data = @json($weeklyData);
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(d => d.day),
                    datasets: [{
                        label: 'Focus Minutes',
                        data: data.map(d => d.minutes),
                        backgroundColor: 'rgba(45,147,117,0.1)',
                        borderColor: '#2D9375',
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#2D9375',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 } } },
                        y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { color: '#9ca3af', font: { size: 11 } } }
                    }
                }
            });
        }
    }
}
</script>
</x-app-layout>
