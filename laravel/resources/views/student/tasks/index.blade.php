<x-app-layout>
    <x-slot:title>งานของฉัน</x-slot:title>

    <div x-data="tasks()" class="space-y-6">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900" x-text="lang === 'th' ? '✅ งานของฉัน' : '✅ My Tasks'"></h1>
            <button @click="showForm = !showForm" class="btn-primary">
                <span x-text="lang === 'th' ? '+ เพิ่มงาน' : '+ Add Task'"></span>
            </button>
        </div>

        {{-- Add Task Form --}}
        <div x-show="showForm" x-transition class="card">
            <h3 class="font-semibold text-gray-800 mb-4" x-text="lang === 'th' ? 'เพิ่มงานใหม่' : 'New Task'"></h3>
            <form method="POST" action="{{ route('student.tasks.store') }}" class="space-y-4">
                @csrf
                <div>
                    <input type="text" name="title" placeholder="ชื่องาน / Task title"
                           class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                           required>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <select name="priority" class="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                        <option value="medium" x-text="lang === 'th' ? 'ความสำคัญ: ปานกลาง' : 'Priority: Medium'">ปานกลาง</option>
                        <option value="low">ต่ำ / Low</option>
                        <option value="high">สูง / High</option>
                        <option value="urgent">ด่วน! / Urgent!</option>
                    </select>
                    <input type="date" name="due_date"
                           class="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                </div>
                <div class="flex justify-end space-x-3">
                    <button type="button" @click="showForm = false" class="btn-secondary" x-text="lang === 'th' ? 'ยกเลิก' : 'Cancel'"></button>
                    <button type="submit" class="btn-primary" x-text="lang === 'th' ? 'บันทึก' : 'Save'"></button>
                </div>
            </form>
        </div>

        {{-- Filter Tabs --}}
        <div class="flex space-x-2">
            @foreach(['all' => 'ทั้งหมด', 'todo' => 'รอทำ', 'in_progress' => 'กำลังทำ', 'completed' => 'เสร็จแล้ว'] as $status => $label)
            <a href="{{ route('student.tasks.index', ['status' => $status]) }}"
               class="{{ request('status', 'all') === $status ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50' }} px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                {{ $label }}
            </a>
            @endforeach
        </div>

        {{-- Task List --}}
        <div class="space-y-3">
            @forelse($tasks as $task)
                <div class="card flex items-center space-x-4 py-4 {{ $task->status === 'completed' ? 'opacity-60' : '' }}">
                    <form method="POST" action="{{ route('student.tasks.toggle', $task) }}">
                        @csrf @method('PATCH')
                        <button type="submit"
                                class="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                                {{ $task->status === 'completed' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-indigo-500' }}">
                            @if($task->status === 'completed')
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                                </svg>
                            @endif
                        </button>
                    </form>

                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 {{ $task->status === 'completed' ? 'line-through text-gray-400' : '' }}">
                            {{ $task->title }}
                        </p>
                        <div class="flex items-center space-x-2 mt-1">
                            <span class="text-xs px-2 py-0.5 rounded-full {{ match($task->priority) {
                                'urgent' => 'bg-red-100 text-red-700',
                                'high'   => 'bg-orange-100 text-orange-700',
                                'medium' => 'bg-yellow-100 text-yellow-700',
                                default  => 'bg-gray-100 text-gray-600'
                            } }}">{{ $task->priority }}</span>
                            @if($task->due_date)
                                <span class="text-xs text-gray-400">📅 {{ $task->due_date->format('d/m/Y') }}</span>
                            @endif
                        </div>
                    </div>

                    <form method="POST" action="{{ route('student.tasks.destroy', $task) }}">
                        @csrf @method('DELETE')
                        <button type="submit" class="text-gray-300 hover:text-red-500 transition-colors"
                                onclick="return confirm('ลบงานนี้?')">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </form>
                </div>
            @empty
                <div class="card text-center py-12">
                    <p class="text-4xl mb-3">📋</p>
                    <p class="text-gray-500" x-text="lang === 'th' ? 'ไม่มีงาน กดเพิ่มงานใหม่ได้เลย!' : 'No tasks. Add one!'"></p>
                </div>
            @endforelse
        </div>
    </div>

    <script>
    function tasks() {
        return { lang: localStorage.getItem('lang') || 'th', showForm: false }
    }
    </script>
</x-app-layout>
