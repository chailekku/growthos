<x-app-layout>
<x-slot:title>Focus Mode</x-slot:title>

<div x-data="focusTimer()" class="max-w-6xl mx-auto space-y-6">

    {{-- ── Header ──────────────────────────────────────────────── --}}
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Focus Mode</h1>
            <p class="text-sm text-gray-400 mt-0.5">Start Session — Build deep work habits</p>
        </div>
        <div class="text-sm font-medium text-gray-500">
            Today's Focus: <span class="font-bold text-gray-900">{{ $recentSessions->where('status','completed')->sum('actual_minutes') }} min</span>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {{-- ── Left: Timer ─────────────────────────────────────── --}}
        <div class="lg:col-span-2 space-y-5">

            {{-- Timer Card --}}
            <div class="bg-white rounded-2xl border border-gray-100 p-8 text-center" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
                <div class="relative inline-block mb-6">
                    <svg class="w-52 h-52 -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" stroke-width="6"/>
                        <circle cx="60" cy="60" r="52" fill="none"
                                :stroke="modeColors[type].stroke"
                                stroke-width="6"
                                stroke-linecap="round"
                                :stroke-dasharray="326.7"
                                :stroke-dashoffset="326.7 * (1 - progress)"
                                class="transition-all duration-1000"/>
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div>
                            <div class="text-4xl font-bold text-gray-900 tracking-tight" x-text="timeDisplay"></div>
                            <div class="text-xs text-gray-400 mt-1 font-medium" x-text="sessionLabel"></div>
                        </div>
                    </div>
                </div>

                {{-- Controls --}}
                <div class="flex items-center justify-center gap-4">
                    <button x-show="!running"
                            @click="startSession"
                            class="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white text-base font-semibold hover:opacity-90 transition-opacity"
                            style="background-color:#2D9375;">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        Start Focus
                    </button>
                    <button x-show="running"
                            @click="endSession"
                            class="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white text-base font-semibold hover:opacity-90 transition-opacity bg-red-500">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        Stop
                    </button>
                </div>

                <p class="text-xs text-gray-400 mt-4" x-text="running ? 'Session in progress — stay focused!' : 'Select a mode and click Start Focus'"></p>
            </div>

            {{-- Mode Cards --}}
            <div class="grid grid-cols-3 gap-4" x-show="!running">
                {{-- Pomodoro --}}
                <button @click="selectType('pomodoro', 25)"
                        :class="type === 'pomodoro' ? 'ring-2 ring-offset-2' : ''"
                        style="ring-color: #f87171"
                        class="bg-red-50 rounded-2xl p-5 text-left hover:bg-red-100 transition-colors border border-transparent"
                        :style="type === 'pomodoro' ? 'border-color:#f87171;' : ''">
                    <div class="text-2xl mb-2">🍅</div>
                    <p class="text-sm font-bold text-gray-800">Pomodoro</p>
                    <p class="text-xs text-gray-500 mt-0.5">25 min · Classic focus block</p>
                </button>

                {{-- Deep Work --}}
                <button @click="selectType('deep_work', 50)"
                        class="bg-blue-50 rounded-2xl p-5 text-left hover:bg-blue-100 transition-colors border border-transparent"
                        :style="type === 'deep_work' ? 'border-color:#60a5fa;' : ''">
                    <div class="text-2xl mb-2">💡</div>
                    <p class="text-sm font-bold text-gray-800">Deep Work</p>
                    <p class="text-xs text-gray-500 mt-0.5">50 min · Extended concentration</p>
                </button>

                {{-- Custom --}}
                <button @click="selectType('custom', customMins)"
                        class="bg-yellow-50 rounded-2xl p-5 text-left hover:bg-yellow-100 transition-colors border border-transparent"
                        :style="type === 'custom' ? 'border-color:#fbbf24;' : ''">
                    <div class="text-2xl mb-2">⚙️</div>
                    <p class="text-sm font-bold text-gray-800">Custom</p>
                    <div class="mt-2" @click.stop>
                        <input type="range" min="5" max="120" step="5" x-model="customMins" @input="if(type==='custom') selectType('custom', customMins)"
                               class="w-full accent-yellow-500">
                        <p class="text-xs text-gray-500 mt-0.5" x-text="customMins + ' min'"></p>
                    </div>
                </button>
            </div>

            {{-- Recent Sessions --}}
            @if($recentSessions->isNotEmpty())
            <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
                <p class="text-sm font-semibold text-gray-900 mb-4">Recent Sessions</p>
                <div class="space-y-2">
                    @foreach($recentSessions as $session)
                    <div class="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <div class="flex items-center gap-3">
                            <div class="h-8 w-8 rounded-xl {{ $session->type === 'pomodoro' ? 'bg-red-50' : ($session->type === 'deep_work' ? 'bg-blue-50' : 'bg-yellow-50') }} flex items-center justify-center text-base">
                                {{ $session->type === 'pomodoro' ? '🍅' : ($session->type === 'deep_work' ? '💡' : '⚡') }}
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-700">{{ ucfirst(str_replace('_',' ', $session->type)) }}</p>
                                <p class="text-xs text-gray-400">{{ $session->started_at->diffForHumans() }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-sm font-semibold text-gray-700">{{ $session->actual_minutes }}m</span>
                            <span class="text-xs px-2 py-0.5 rounded-full font-medium {{ $session->status === 'completed' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500' }}">
                                {{ ucfirst($session->status) }}
                            </span>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            @endif
        </div>

        {{-- ── Right: Analytics ────────────────────────────────── --}}
        <div class="space-y-5">

            {{-- Focus Analytics --}}
            <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
                <p class="text-sm font-semibold text-gray-900 mb-4">Focus Analytics</p>
                <div class="text-center mb-4">
                    <p class="text-3xl font-bold text-gray-900">{{ $recentSessions->where('status','completed')->sum('actual_minutes') }}<span class="text-base font-normal text-gray-400 ml-1">min</span></p>
                    <p class="text-xs text-gray-400 mt-0.5">Today's Focus</p>
                </div>
                <p class="text-xs font-semibold text-gray-600 mb-2">This Week</p>
                <canvas id="weeklyFocusChart" height="100"></canvas>
            </div>

            {{-- Best Focus Time --}}
            <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
                <p class="text-sm font-semibold text-gray-900 mb-3">Best Focus Time</p>
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-teal-700 bg-teal-50">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    9:00 – 11:00 AM
                </div>
                <p class="text-xs text-gray-400 mt-2">Based on your historical sessions</p>
            </div>

            {{-- AI Recommendation --}}
            <div class="rounded-2xl p-5 border" style="background:linear-gradient(135deg,#f0faf5 0%,#e8f8f0 100%); border-color:#c3e6cb;">
                <div class="flex items-center gap-2 mb-2">
                    <svg class="h-4 w-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                    <span class="text-xs font-semibold text-teal-700">AI Recommendation</span>
                </div>
                <p class="text-xs text-gray-600 leading-relaxed">
                    Try a 50-min Deep Work session this morning — your focus quality is highest between 9–11am based on your patterns.
                </p>
            </div>
        </div>
    </div>
</div>

<script>
function focusTimer() {
    return {
        running: false,
        type: 'pomodoro',
        customMins: 30,
        totalSeconds: 25 * 60,
        remainingSeconds: 25 * 60,
        sessionId: null,
        timer: null,
        modeColors: {
            pomodoro: { stroke: '#f87171' },
            deep_work: { stroke: '#60a5fa' },
            custom: { stroke: '#fbbf24' },
        },
        get progress() { return 1 - this.remainingSeconds / this.totalSeconds; },
        get timeDisplay() {
            const m = Math.floor(this.remainingSeconds / 60);
            const s = this.remainingSeconds % 60;
            return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        },
        get sessionLabel() {
            const labels = { pomodoro: 'Pomodoro 🍅', deep_work: 'Deep Work 💡', custom: 'Custom ⚙️' };
            return labels[this.type] || 'Focus ⚡';
        },
        selectType(type, mins) {
            this.type = type;
            this.totalSeconds = mins * 60;
            this.remainingSeconds = mins * 60;
        },
        async startSession() {
            const res = await fetch('{{ route('student.focus.start') }}', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').content },
                body: JSON.stringify({ type: this.type, planned_minutes: Math.floor(this.totalSeconds / 60) })
            });
            const data = await res.json();
            this.sessionId = data.session_id;
            this.running = true;
            this.timer = setInterval(() => {
                if (this.remainingSeconds > 0) {
                    this.remainingSeconds--;
                } else {
                    this.endSession();
                }
            }, 1000);
        },
        async endSession() {
            clearInterval(this.timer);
            this.running = false;
            if (!this.sessionId) return;
            const elapsed = Math.floor((this.totalSeconds - this.remainingSeconds) / 60);
            await fetch(`/student/focus/${this.sessionId}/end`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').content },
                body: JSON.stringify({ actual_minutes: elapsed })
            });
            this.sessionId = null;
            this.remainingSeconds = this.totalSeconds;
            window.location.reload();
        },
        init() {
            this.$nextTick(() => this.renderChart());
        },
        renderChart() {
            const ctx = document.getElementById('weeklyFocusChart');
            if (!ctx || !window.Chart) return;
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
                    datasets: [{
                        data: [45, 87, 30, 60, 75, 20, 50],
                        backgroundColor: 'rgba(45,147,117,0.15)',
                        borderColor: '#2D9375',
                        borderWidth: 2,
                        borderRadius: 6,
                        borderSkipped: false,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 10 } } },
                        y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { color: '#9ca3af', font: { size: 10 } } }
                    }
                }
            });
        }
    }
}
</script>
</x-app-layout>
