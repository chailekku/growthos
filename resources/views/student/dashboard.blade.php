<x-app-layout>
    <x-slot:title>แดชบอร์ด</x-slot:title>

    <div x-data="dashboard()" class="space-y-6">

        {{-- Header --}}
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">
                    <span x-text="lang === 'th' ? 'สวัสดี' : 'Hello'"></span>,
                    {{ auth()->user()->name }} 👋
                </h1>
                <p class="text-gray-500 text-sm mt-1" x-text="lang === 'th' ? 'วันนี้คุณพร้อมสำหรับการเติบโตแล้วหรือยัง?' : 'Ready to grow today?'"></p>
            </div>
            <div class="text-right text-sm text-gray-500">
                {{ now()->locale('th')->isoFormat('dddd, D MMMM YYYY') }}
            </div>
        </div>

        {{-- Stats Row --}}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="card text-center">
                <div class="text-3xl font-bold text-indigo-600">{{ $todayFocusMinutes }}</div>
                <div class="text-xs text-gray-500 mt-1" x-text="lang === 'th' ? 'นาทีโฟกัสวันนี้' : 'Focus min today'"></div>
            </div>
            <div class="card text-center">
                <div class="text-3xl font-bold text-green-600">{{ $tasksCompleted }}/{{ $tasksTotal }}</div>
                <div class="text-xs text-gray-500 mt-1" x-text="lang === 'th' ? 'งานสำเร็จวันนี้' : 'Tasks done today'"></div>
            </div>
            <div class="card text-center">
                <div class="text-3xl font-bold text-orange-600">{{ $currentStreak }}</div>
                <div class="text-xs text-gray-500 mt-1" x-text="lang === 'th' ? 'วันต่อเนื่อง 🔥' : 'Day streak 🔥'"></div>
            </div>
            <div class="card text-center">
                <div class="text-3xl font-bold text-purple-600">{{ $weeklyFocusMinutes }}</div>
                <div class="text-xs text-gray-500 mt-1" x-text="lang === 'th' ? 'นาทีโฟกัสสัปดาห์นี้' : 'Weekly focus min'"></div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {{-- Weekly Focus Chart --}}
            <div class="card lg:col-span-2">
                <h3 class="font-semibold text-gray-800 mb-4" x-text="lang === 'th' ? '📊 สถิติโฟกัส 7 วัน' : '📊 7-Day Focus Stats'"></h3>
                <canvas id="focusChart" height="100"></canvas>
            </div>

            {{-- Mood Today --}}
            <div class="card">
                <h3 class="font-semibold text-gray-800 mb-4" x-text="lang === 'th' ? '😊 อารมณ์วันนี้' : '😊 Today\'s Mood'"></h3>
                @if($todayMood)
                    <div class="text-center py-4">
                        <div class="text-5xl mb-2">
                            {{ ['😞', '😕', '😐', '🙂', '😄'][$todayMood->mood - 1] }}
                        </div>
                        <p class="text-gray-600 text-sm">
                            <span x-text="lang === 'th' ? 'พลังงาน:' : 'Energy:'"></span>
                            {{ $todayMood->energy }}/5
                        </p>
                    </div>
                @else
                    <div class="text-center py-6">
                        <p class="text-gray-400 text-sm mb-4" x-text="lang === 'th' ? 'ยังไม่ได้บันทึกอารมณ์วันนี้' : 'No mood logged today'"></p>
                        <a href="{{ route('student.reflection.index') }}" class="btn-primary text-xs">
                            <span x-text="lang === 'th' ? 'บันทึกอารมณ์' : 'Log mood'"></span>
                        </a>
                    </div>
                @endif
            </div>
        </div>

        {{-- Recent Tasks & Quick Actions --}}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold text-gray-800" x-text="lang === 'th' ? '✅ งานที่รอทำ' : '✅ Pending Tasks'"></h3>
                    <a href="{{ route('student.tasks.index') }}" class="text-indigo-600 hover:text-indigo-800 text-sm" x-text="lang === 'th' ? 'ดูทั้งหมด →' : 'View all →'"></a>
                </div>
                @forelse($recentTasks as $task)
                    <div class="flex items-center space-x-3 py-2 border-b border-gray-50 last:border-0">
                        <span class="w-2 h-2 rounded-full flex-shrink-0 {{ match($task->priority) {
                            'urgent' => 'bg-red-500',
                            'high'   => 'bg-orange-500',
                            'medium' => 'bg-yellow-500',
                            default  => 'bg-gray-300'
                        } }}"></span>
                        <span class="text-sm text-gray-700 flex-1 truncate">{{ $task->title }}</span>
                        @if($task->due_date)
                            <span class="text-xs text-gray-400">{{ $task->due_date->format('d/m') }}</span>
                        @endif
                    </div>
                @empty
                    <p class="text-gray-400 text-sm text-center py-4" x-text="lang === 'th' ? '🎉 ไม่มีงานค้าง!' : '🎉 No pending tasks!'"></p>
                @endforelse
            </div>

            <div class="card">
                <h3 class="font-semibold text-gray-800 mb-4" x-text="lang === 'th' ? '⚡ ทำได้เลย' : '⚡ Quick Actions'"></h3>
                <div class="grid grid-cols-2 gap-3">
                    <a href="{{ route('student.focus.index') }}"
                       class="flex flex-col items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors text-center">
                        <span class="text-2xl mb-1">🎯</span>
                        <span class="text-sm font-medium text-indigo-700" x-text="lang === 'th' ? 'เริ่มโฟกัส' : 'Start Focus'"></span>
                    </a>
                    <a href="{{ route('student.reflection.index') }}"
                       class="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center">
                        <span class="text-2xl mb-1">📓</span>
                        <span class="text-sm font-medium text-purple-700" x-text="lang === 'th' ? 'เขียนบันทึก' : 'Write Journal'"></span>
                    </a>
                    <a href="{{ route('student.ai-coach.index') }}"
                       class="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-center">
                        <span class="text-2xl mb-1">🤖</span>
                        <span class="text-sm font-medium text-green-700" x-text="lang === 'th' ? 'คุยกับ AI' : 'Chat AI'"></span>
                    </a>
                    <a href="{{ route('student.tasks.index') }}"
                       class="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors text-center">
                        <span class="text-2xl mb-1">➕</span>
                        <span class="text-sm font-medium text-orange-700" x-text="lang === 'th' ? 'เพิ่มงาน' : 'Add Task'"></span>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <script>
    function dashboard() {
        return {
            lang: localStorage.getItem('lang') || 'th',
            init() {
                this.$nextTick(() => this.renderChart());
            },
            renderChart() {
                const ctx = document.getElementById('focusChart');
                if (!ctx) return;
                const data = @json($weeklyData);
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.map(d => d.day),
                        datasets: [{
                            label: this.lang === 'th' ? 'นาที' : 'Minutes',
                            data: data.map(d => d.minutes),
                            backgroundColor: 'rgba(99, 102, 241, 0.6)',
                            borderColor: 'rgb(99, 102, 241)',
                            borderWidth: 1,
                            borderRadius: 6,
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } }
                    }
                });
            }
        }
    }
    </script>
</x-app-layout>
