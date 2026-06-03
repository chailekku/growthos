<x-app-layout>
<x-slot:title>Growth</x-slot:title>

<div x-data="growth()" x-init="init()" class="space-y-6 max-w-6xl mx-auto">

    {{-- ── Header ──────────────────────────────────────────────── --}}
    <div>
        <h1 class="text-2xl font-bold text-gray-900">Growth Dashboard</h1>
        <p class="text-sm text-gray-400 mt-0.5">Track your personal development across all dimensions</p>
    </div>

    {{-- ── Overall Score ────────────────────────────────────────── --}}
    <div class="bg-white rounded-2xl border border-gray-100 p-6" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
        <div class="flex flex-col sm:flex-row sm:items-center gap-6">
            {{-- Circular score --}}
            <div class="relative inline-block mx-auto sm:mx-0 shrink-0">
                <svg class="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" stroke-width="10"/>
                    <circle cx="60" cy="60" r="50" fill="none"
                            stroke="#f97316"
                            stroke-width="10"
                            stroke-linecap="round"
                            stroke-dasharray="314.16"
                            stroke-dashoffset="{{ 314.16 * (1 - $overallScore/100) }}"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-2xl font-bold text-gray-900">{{ $overallScore }}</span>
                    <span class="text-xs text-gray-400">/100</span>
                </div>
            </div>

            <div class="flex-1">
                <p class="text-lg font-bold text-gray-900 mb-1">Overall Growth Score</p>
                <p class="text-sm text-gray-500 mb-4">Based on habits, goals, wellbeing, and focus quality</p>

                {{-- Sub-metric chips --}}
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    @foreach([
                        ['Habit Consistency',   $metrics['habit_consistency'],   '#2D9375', '#f0faf5'],
                        ['Goal Progress',        $metrics['goal_progress'],        '#f97316', '#fff7ed'],
                        ['Emotional Wellbeing',  $metrics['emotional_wellbeing'],  '#8b5cf6', '#f5f3ff'],
                        ['Focus Quality',        $metrics['focus_quality'],        '#3b82f6', '#eff6ff'],
                    ] as [$label, $val, $color, $bg])
                        <div class="rounded-xl px-3 py-2.5 text-center" style="background-color:{{ $bg }}">
                            <p class="text-xl font-bold" style="color:{{ $color }};">{{ $val }}%</p>
                            <p class="text-xs text-gray-500 mt-0.5 leading-tight">{{ $label }}</p>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>

    {{-- ── Row: Habit Consistency + Goal Progress ───────────────── --}}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {{-- Habit Consistency --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="flex items-center justify-between mb-4">
                <p class="text-sm font-semibold text-gray-900">Habit Consistency</p>
                <span class="text-xs px-2 py-0.5 rounded-full font-semibold" style="background:#f0faf5; color:#2D9375;">{{ $metrics['habit_consistency'] }}%</span>
            </div>
            <div class="space-y-4">
                @foreach($habits as $habit)
                    <div>
                        <div class="flex items-center gap-3 mb-1.5">
                            <div class="h-5 w-5 rounded-full flex items-center justify-center shrink-0 {{ $habit['done'] ? '' : 'border-2 border-gray-200' }}"
                                 style="{{ $habit['done'] ? 'background-color:#2D9375;' : '' }}">
                                @if($habit['done'])
                                    <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                                @endif
                            </div>
                            <span class="flex-1 text-sm text-gray-700 font-medium">{{ $habit['name'] }}</span>
                            <span class="text-xs font-bold" style="color:#2D9375;">{{ $habit['streak'] }}d 🔥</span>
                        </div>
                        <div class="ml-8">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-xs text-gray-400">Weekly rate</span>
                                <span class="text-xs font-semibold text-gray-600">{{ $habit['weekly'] }}%</span>
                            </div>
                            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all" style="width:{{ $habit['weekly'] }}%; background-color:#2D9375;"></div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>

        {{-- Goal Progress --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="flex items-center justify-between mb-4">
                <p class="text-sm font-semibold text-gray-900">Goal Progress</p>
                <span class="text-xs px-2 py-0.5 rounded-full font-semibold" style="background:#fff7ed; color:#f97316;">{{ $metrics['goal_progress'] }}%</span>
            </div>
            <div class="space-y-4">
                @foreach($goals as $goal)
                    <div>
                        <div class="flex items-start justify-between gap-2 mb-1.5">
                            <span class="text-sm text-gray-700 font-medium flex-1">{{ $goal['title'] }}</span>
                            <span class="text-xs text-gray-400 shrink-0">Due {{ $goal['due'] }}</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div class="h-full rounded-full bg-orange-400 transition-all" style="width:{{ $goal['progress'] }}%;"></div>
                            </div>
                            <span class="text-xs font-bold text-gray-600 w-8 text-right">{{ $goal['progress'] }}%</span>
                        </div>
                    </div>
                @endforeach
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span class="text-xs text-gray-500">Average progress</span>
                <span class="text-sm font-bold text-gray-900">{{ round(collect($goals)->avg('progress')) }}%</span>
            </div>
        </div>
    </div>

    {{-- ── Row: Emotional Wellbeing + Focus Quality ─────────────── --}}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {{-- Emotional Wellbeing --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="flex items-center justify-between mb-4">
                <p class="text-sm font-semibold text-gray-900">Emotional Wellbeing</p>
                <span class="text-xs px-2 py-0.5 rounded-full font-semibold" style="background:#f5f3ff; color:#8b5cf6;">{{ $metrics['emotional_wellbeing'] }}%</span>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-xs font-semibold text-gray-600 mb-2">Mood Distribution</p>
                    <canvas id="moodDonutChart" height="160"></canvas>
                </div>
                <div>
                    <p class="text-xs font-semibold text-gray-600 mb-2">7-Day Trend</p>
                    <canvas id="moodTrendChart" height="160"></canvas>
                </div>
            </div>
        </div>

        {{-- Focus Quality --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="flex items-center justify-between mb-4">
                <p class="text-sm font-semibold text-gray-900">Focus Quality</p>
                <span class="text-xs px-2 py-0.5 rounded-full font-semibold" style="background:#eff6ff; color:#3b82f6;">{{ $metrics['focus_quality'] }}%</span>
            </div>
            <canvas id="focusBarChart" height="100" class="mb-4"></canvas>
            <div class="grid grid-cols-3 gap-3">
                <div class="text-center rounded-xl p-3" style="background:#eff6ff;">
                    <p class="text-base font-bold text-blue-600">87m</p>
                    <p class="text-xs text-gray-500">Avg/Day</p>
                </div>
                <div class="text-center rounded-xl p-3" style="background:#eff6ff;">
                    <p class="text-base font-bold text-blue-600">{{ $metrics['focus_quality'] }}%</p>
                    <p class="text-xs text-gray-500">Quality Score</p>
                </div>
                <div class="text-center rounded-xl p-3" style="background:#eff6ff;">
                    <p class="text-base font-bold text-blue-600">9am</p>
                    <p class="text-xs text-gray-500">Best Time</p>
                </div>
            </div>
            <div class="mt-3 rounded-xl p-3 border" style="background:#f0faf5; border-color:#c3e6cb;">
                <p class="text-xs font-semibold text-teal-700 mb-1">AI Recommendation</p>
                <p class="text-xs text-gray-600">Schedule your most challenging tasks during your 9–11am peak focus window.</p>
            </div>
        </div>
    </div>

    {{-- ── Self-Leadership Radar ─────────────────────────────────── --}}
    <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
        <p class="text-sm font-semibold text-gray-900 mb-4">Self-Leadership</p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div class="flex justify-center">
                <canvas id="radarChart" width="280" height="280"></canvas>
            </div>
            <div class="space-y-3">
                @foreach([
                    ['Self-Awareness',  $selfLeadership['self_awareness'],  '#2D9375'],
                    ['Self-Regulation', $selfLeadership['self_regulation'], '#3b82f6'],
                    ['Motivation',      $selfLeadership['motivation'],      '#f97316'],
                    ['Empathy',         $selfLeadership['empathy'],         '#8b5cf6'],
                    ['Social Skills',   $selfLeadership['social_skills'],   '#ec4899'],
                ] as [$label, $val, $color])
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-sm font-medium text-gray-700">{{ $label }}</span>
                            <span class="text-sm font-bold" style="color:{{ $color }};">{{ $val }}%</span>
                        </div>
                        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all" style="width:{{ $val }}%; background-color:{{ $color }};"></div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    {{-- ── Productivity Trends ──────────────────────────────────── --}}
    <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
        <div class="flex items-center justify-between mb-4">
            <p class="text-sm font-semibold text-gray-900">Productivity Trends</p>
            <span class="text-xs text-gray-400">Last 30 days</span>
        </div>
        <canvas id="productivityChart" height="80" class="mb-4"></canvas>
        <div class="grid grid-cols-2 gap-4">
            <div class="rounded-xl p-4" style="background:#f0faf5; border:1px solid #c3e6cb;">
                <div class="flex items-center gap-2 mb-1">
                    <svg class="h-4 w-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 2 16"/><polyline points="17 6 23 6 23 12"/></svg>
                    <span class="text-xs font-semibold text-teal-700">Best Day</span>
                </div>
                <p class="text-base font-bold text-gray-900">Friday</p>
                <p class="text-xs text-gray-500">90 min avg focus</p>
            </div>
            <div class="rounded-xl p-4" style="background:#fff7ed; border:1px solid #fed7aa;">
                <div class="flex items-center gap-2 mb-1">
                    <svg class="h-4 w-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 2 8"/><polyline points="17 18 23 18 23 12"/></svg>
                    <span class="text-xs font-semibold text-orange-600">Toughest Day</span>
                </div>
                <p class="text-base font-bold text-gray-900">Saturday</p>
                <p class="text-xs text-gray-500">20 min avg focus</p>
            </div>
        </div>
    </div>
</div>

<script>
function growth() {
    return {
        init() {
            this.$nextTick(() => this.renderCharts());
        },
        renderCharts() {
            if (!window.Chart) return;

            // Mood Donut
            const moodCtx = document.getElementById('moodDonutChart');
            if (moodCtx) {
                new Chart(moodCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Great','Good','Okay','Low','Struggling'],
                        datasets: [{
                            data: [3, 8, 5, 2, 1],
                            backgroundColor: ['#10b981','#2D9375','#fbbf24','#f97316','#ef4444'],
                            borderWidth: 0,
                            hoverOffset: 4,
                        }]
                    },
                    options: {
                        cutout: '65%',
                        plugins: { legend: { display: false } },
                        responsive: true,
                    }
                });
            }

            // Mood Trend Line
            const trendCtx = document.getElementById('moodTrendChart');
            if (trendCtx) {
                new Chart(trendCtx, {
                    type: 'line',
                    data: {
                        labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
                        datasets: [{
                            data: [3,4,3,5,4,3,4],
                            borderColor: '#8b5cf6',
                            backgroundColor: 'rgba(139,92,246,0.1)',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 3,
                            borderWidth: 2,
                        }]
                    },
                    options: {
                        scales: {
                            x: { grid:{display:false}, ticks:{color:'#9ca3af',font:{size:9}} },
                            y: { min:1, max:5, grid:{color:'#f3f4f6'}, ticks:{color:'#9ca3af',font:{size:9}} }
                        },
                        plugins: { legend:{display:false} },
                        responsive: true,
                    }
                });
            }

            // Focus Bar
            const focusCtx = document.getElementById('focusBarChart');
            if (focusCtx) {
                new Chart(focusCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
                        datasets: [{
                            data: [45,87,30,60,90,20,55],
                            backgroundColor: 'rgba(59,130,246,0.15)',
                            borderColor: '#3b82f6',
                            borderWidth: 2,
                            borderRadius: 5,
                            borderSkipped: false,
                        }]
                    },
                    options: {
                        scales: {
                            x: { grid:{display:false}, ticks:{color:'#9ca3af',font:{size:10}} },
                            y: { beginAtZero:true, grid:{color:'#f3f4f6'}, ticks:{color:'#9ca3af',font:{size:10}} }
                        },
                        plugins: { legend:{display:false} },
                        responsive: true,
                    }
                });
            }

            // Radar Chart
            const radarCtx = document.getElementById('radarChart');
            if (radarCtx) {
                new Chart(radarCtx, {
                    type: 'radar',
                    data: {
                        labels: ['Self-Awareness','Self-Regulation','Motivation','Empathy','Social Skills'],
                        datasets: [{
                            data: @json(array_values($selfLeadership)),
                            backgroundColor: 'rgba(45,147,117,0.15)',
                            borderColor: '#2D9375',
                            borderWidth: 2,
                            pointBackgroundColor: '#2D9375',
                            pointRadius: 4,
                        }]
                    },
                    options: {
                        scales: {
                            r: {
                                beginAtZero: true,
                                max: 100,
                                grid: { color: '#e5e7eb' },
                                pointLabels: { font: { size: 11 }, color: '#6b7280' },
                                ticks: { display: false, stepSize: 25 },
                            }
                        },
                        plugins: { legend: { display: false } },
                        responsive: false,
                    }
                });
            }

            // Productivity Trends (area)
            const prodCtx = document.getElementById('productivityChart');
            if (prodCtx) {
                const days = @json($productivityDays);
                const vals = @json($productivityData);
                // Expand to 30 days by repeating pattern
                const labels30 = [];
                const data30 = [];
                for (let i = 0; i < 30; i++) {
                    labels30.push(i === 0 ? '30d ago' : i === 29 ? 'Today' : '');
                    data30.push(vals[i % vals.length] + Math.floor(Math.random()*15 - 7));
                }
                new Chart(prodCtx, {
                    type: 'line',
                    data: {
                        labels: labels30,
                        datasets: [{
                            data: data30,
                            backgroundColor: 'rgba(45,147,117,0.1)',
                            borderColor: '#2D9375',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2,
                            pointRadius: 0,
                        }]
                    },
                    options: {
                        scales: {
                            x: { grid:{display:false}, ticks:{color:'#9ca3af',font:{size:10}} },
                            y: { beginAtZero:true, grid:{color:'#f3f4f6'}, ticks:{color:'#9ca3af',font:{size:10}} }
                        },
                        plugins: { legend:{display:false} },
                        responsive: true,
                    }
                });
            }
        }
    }
}
</script>
</x-app-layout>
