<x-app-layout>
<x-slot:title>Tasks &amp; Planner</x-slot:title>

<div x-data="tasks()" class="space-y-6 max-w-5xl mx-auto">

    {{-- ── Header ──────────────────────────────────────────────── --}}
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Tasks &amp; Planner</h1>
            <p class="text-sm text-gray-400 mt-0.5">Manage your tasks and stay on track</p>
        </div>
        <button @click="showForm = !showForm"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                style="background-color:#2D9375;">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            Add Task
        </button>
    </div>

    {{-- ── 3 Stat Cards ─────────────────────────────────────────── --}}
    <div class="grid grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <div>
                <p class="text-2xl font-bold text-gray-900">{{ $tasks->total() }}</p>
                <p class="text-xs text-gray-500 font-medium">Tasks &amp; Planner</p>
            </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                <svg class="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
                @php $completedCount = $tasks->getCollection()->where('status','completed')->count(); @endphp
                <p class="text-2xl font-bold text-gray-900">{{ $completedCount }}</p>
                <p class="text-xs text-gray-500 font-medium">Completed</p>
            </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
            <div>
                @php $overdueCount = $tasks->getCollection()->filter(fn($t) => $t->due_date && $t->due_date->isPast() && $t->status !== 'completed')->count(); @endphp
                <p class="text-2xl font-bold text-gray-900">{{ $overdueCount }}</p>
                <p class="text-xs text-gray-500 font-medium">Overdue</p>
            </div>
        </div>
    </div>

    {{-- ── Add Task Form ─────────────────────────────────────────── --}}
    <div x-show="showForm" x-transition class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
        <h3 class="font-semibold text-gray-800 mb-4">New Task</h3>
        <form method="POST" action="{{ route('student.tasks.store') }}" class="space-y-4">
            @csrf
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Task title</label>
                <input type="text" name="title" placeholder="What needs to be done?"
                       class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:border-transparent outline-none"
                       style="focus-ring-color:#2D9375" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                    <select name="priority" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 outline-none">
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent!</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
                    <input type="date" name="due_date"
                           class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 outline-none">
                </div>
            </div>
            <div class="flex justify-end gap-3">
                <button type="button" @click="showForm = false"
                        class="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                    Cancel
                </button>
                <button type="submit"
                        class="px-4 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
                        style="background-color:#2D9375;">
                    Save Task
                </button>
            </div>
        </form>
    </div>

    {{-- ── Filter Bar ───────────────────────────────────────────── --}}
    <div class="bg-white rounded-2xl border border-gray-100 p-1.5 flex flex-wrap gap-1" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
        @foreach([
            'all'        => 'List',
            'todo'       => 'Today',
            'in_progress'=> 'Upcoming',
            'completed'  => 'Completed',
            'overdue'    => 'Overdue',
        ] as $status => $label)
        <a href="{{ route('student.tasks.index', ['status' => $status]) }}"
           class="{{ request('status', 'all') === $status
               ? 'text-white rounded-xl px-4 py-2 text-sm font-semibold'
               : 'text-gray-600 rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-50' }}"
           style="{{ request('status', 'all') === $status ? 'background-color:#2D9375;' : '' }}">
            {{ $label }}
        </a>
        @endforeach
    </div>

    {{-- ── Task List ────────────────────────────────────────────── --}}
    <div class="space-y-3">
        @forelse($tasks as $task)
            <div class="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-4 {{ $task->status === 'completed' ? 'opacity-60' : '' }}"
                 style="box-shadow:0 2px 8px rgba(0,0,0,.06); border-left: 3px solid {{ match($task->priority) { 'urgent'=>'#ef4444','high'=>'#f97316','medium'=>'#3b82f6',default=>'#d1d5db' } }};">

                {{-- Toggle --}}
                <form method="POST" action="{{ route('student.tasks.toggle', $task) }}" class="mt-0.5">
                    @csrf @method('PATCH')
                    <button type="submit"
                            class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                                   {{ $task->status === 'completed' ? 'border-transparent text-white' : 'border-gray-300 hover:border-teal-500' }}"
                            style="{{ $task->status === 'completed' ? 'background-color:#2D9375;' : '' }}">
                        @if($task->status === 'completed')
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        @endif
                    </button>
                </form>

                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-900 {{ $task->status === 'completed' ? 'line-through text-gray-400' : '' }}">
                        {{ $task->title }}
                    </p>
                    <div class="flex flex-wrap items-center gap-2 mt-1.5">
                        @if($task->due_date)
                            <span class="flex items-center gap-1 text-xs text-gray-400">
                                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                {{ $task->due_date->format('M j, Y') }}
                            </span>
                        @endif
                        <span class="text-xs px-2 py-0.5 rounded-full font-medium {{ match($task->status) { 'completed'=>'bg-teal-100 text-teal-700','in_progress'=>'bg-blue-100 text-blue-700',default=>'bg-gray-100 text-gray-600' } }}">
                            {{ ucfirst(str_replace('_',' ',$task->status)) }}
                        </span>
                        <span class="text-xs px-2 py-0.5 rounded-full font-medium {{ match($task->priority) { 'urgent'=>'bg-red-100 text-red-700','high'=>'bg-orange-100 text-orange-700','medium'=>'bg-blue-100 text-blue-700',default=>'bg-gray-100 text-gray-600' } }}">
                            {{ ucfirst($task->priority) }}
                        </span>
                    </div>
                </div>

                {{-- Delete --}}
                <form method="POST" action="{{ route('student.tasks.destroy', $task) }}" class="shrink-0">
                    @csrf @method('DELETE')
                    <button type="submit"
                            class="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                            onclick="return confirm('Delete this task?')">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                </form>
            </div>
        @empty
            <div class="bg-white rounded-2xl border border-gray-100 p-12 text-center" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
                <div class="text-5xl mb-4">📋</div>
                <p class="text-gray-500 font-medium">No tasks found</p>
                <p class="text-sm text-gray-400 mt-1">Add a task to get started</p>
            </div>
        @endforelse
    </div>

    {{ $tasks->links() }}
</div>

<script>
function tasks() {
    return { showForm: {{ $errors->any() ? 'true' : 'false' }} }
}
</script>
</x-app-layout>
