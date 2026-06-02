<x-app-layout>
    <x-slot:title>โฟกัส</x-slot:title>

    <div x-data="focusTimer()" class="max-w-2xl mx-auto space-y-6">
        <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-900" x-text="lang === 'th' ? '🎯 โฟกัส & Pomodoro' : '🎯 Focus & Pomodoro'"></h1>
            <p class="text-gray-500 text-sm mt-1" x-text="lang === 'th' ? 'โฟกัสอย่างมีประสิทธิภาพ บรรลุเป้าหมายทีละขั้น' : 'Focus efficiently, achieve goals step by step'"></p>
        </div>

        {{-- Timer Card --}}
        <div class="card text-center py-8">
            <div class="relative inline-block mb-6">
                <svg class="w-48 h-48 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" stroke-width="8"/>
                    <circle cx="60" cy="60" r="54" fill="none"
                            stroke="#6366f1" stroke-width="8"
                            stroke-linecap="round"
                            :stroke-dasharray="339.3"
                            :stroke-dashoffset="339.3 * (1 - progress)"
                            class="transition-all duration-1000"/>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div>
                        <div class="text-4xl font-bold text-gray-900" x-text="timeDisplay"></div>
                        <div class="text-xs text-gray-500 mt-1" x-text="sessionLabel"></div>
                    </div>
                </div>
            </div>

            {{-- Controls --}}
            <div class="flex items-center justify-center space-x-4">
                <button x-show="!running && !sessionId"
                        @click="startSession"
                        class="btn-primary px-8 py-3 text-base">
                    <span x-text="lang === 'th' ? '▶ เริ่มโฟกัส' : '▶ Start Focus'"></span>
                </button>
                <button x-show="running"
                        @click="endSession"
                        class="px-8 py-3 text-base bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                    <span x-text="lang === 'th' ? '⏹ หยุด' : '⏹ Stop'"></span>
                </button>
            </div>

            {{-- Session Type Picker --}}
            <div x-show="!running" class="mt-6 flex justify-center space-x-2">
                @foreach([
                    ['type' => 'pomodoro', 'mins' => 25, 'label' => 'Pomodoro'],
                    ['type' => 'deep_work', 'mins' => 90, 'label' => 'Deep Work'],
                    ['type' => 'short_focus', 'mins' => 15, 'label' => '15 นาที'],
                    ['type' => 'study', 'mins' => 50, 'label' => 'Study'],
                ] as $s)
                <button @click="selectType('{{ $s['type'] }}', {{ $s['mins'] }})"
                        :class="type === '{{ $s['type'] }}' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                    {{ $s['label'] }}
                </button>
                @endforeach
            </div>
        </div>

        {{-- Recent Sessions --}}
        @if($recentSessions->isNotEmpty())
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-4" x-text="lang === 'th' ? '📈 เซสชันล่าสุด' : '📈 Recent Sessions'"></h3>
            <div class="space-y-2">
                @foreach($recentSessions as $session)
                <div class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                        <span class="text-sm font-medium text-gray-700">{{ $session->type }}</span>
                        <span class="text-xs text-gray-400 ml-2">{{ $session->started_at->diffForHumans() }}</span>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="text-sm text-gray-600">{{ $session->actual_minutes }} <span x-text="lang === 'th' ? 'นาที' : 'min'"></span></span>
                        <span class="text-xs px-2 py-0.5 rounded-full {{ $session->status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500' }}">
                            {{ $session->status }}
                        </span>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
        @endif
    </div>

    <script>
    function focusTimer() {
        return {
            lang: localStorage.getItem('lang') || 'th',
            running: false,
            type: 'pomodoro',
            totalSeconds: 25 * 60,
            remainingSeconds: 25 * 60,
            sessionId: null,
            timer: null,
            get progress() { return 1 - this.remainingSeconds / this.totalSeconds; },
            get timeDisplay() {
                const m = Math.floor(this.remainingSeconds / 60);
                const s = this.remainingSeconds % 60;
                return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            },
            get sessionLabel() {
                return this.type === 'pomodoro' ? 'Pomodoro 🍅' :
                       this.type === 'deep_work' ? 'Deep Work 💡' :
                       this.type === 'study' ? 'Study 📚' : 'Focus ⚡';
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
            }
        }
    }
    </script>
</x-app-layout>
